import { useState, useCallback } from "react";
import { githubService } from "../services/githubService";
import { languageService } from "../services/languageService";
import { repositoryService } from "../services/repositoryService";
import { analyticsService } from "../services/analyticsService";
import { contributorService } from "../services/contributorService";
import { api } from "../services/api";

export const LANGUAGES_SYNCED_EVENT = "languages-synced";
export const ANALYTICS_SYNCED_EVENT = "analytics-synced";
export const CONTRIBUTORS_SYNCED_EVENT = "contributors-synced";
export const CONTRIBUTOR_ACTIVITY_SYNCED_EVENT = "contributor-activity-synced";
export const CATEGORIES_SYNCED_EVENT = "categories-synced";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 403 && response.status !== 429) {
      return response;
    }

    if (attempt === retries) {
      console.warn(`Rate limited on ${url} — out of retries, giving up.`);
      return response;
    }

    const retryAfter = response.headers.get("Retry-After");
    const waitMs =
      retryAfter ?
        parseInt(retryAfter, 10) * 1000
      : baseDelay * Math.pow(2, attempt);

    console.warn(
      `Rate limited on ${url}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})...`,
    );
    await sleep(waitMs);
  }
};

const MAX_COMMIT_PAGES = 3;

const fetchAllCommitsForAuthor = async (
  repoFullName,
  contributorLogin,
  githubToken,
) => {
  let allCommits = [];

  for (let page = 1; page <= MAX_COMMIT_PAGES; page++) {
    const commitsUrl = `https://api.github.com/repos/${repoFullName}/commits?author=${contributorLogin}&per_page=100&page=${page}`;
    const commitsResponse = await fetchWithRetry(commitsUrl, {
      headers: { Authorization: `token ${githubToken}` },
    });

    if (!commitsResponse.ok) {
      console.warn(
        `Failed to fetch commits page ${page} for ${contributorLogin} in ${repoFullName} (status ${commitsResponse.status})`,
      );
      return { commits: allCommits, failed: page === 1 };
    }

    const pageCommits = await commitsResponse.json();
    allCommits = allCommits.concat(pageCommits);

    if (pageCommits.length < 100) break;
  }

  return { commits: allCommits, failed: false };
};

const SYNC_META_KEY = "github_sync_meta_v1";

const loadSyncMeta = () => {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Failed to read sync metadata, starting fresh:", e);
    return {};
  }
};

const saveSyncMeta = (meta) => {
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.warn("Failed to persist sync metadata:", e);
  }
};

const buildRepoFingerprint = (repo) =>
  JSON.stringify({
    pushed_at: repo.pushed_at,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    watchers_count: repo.watchers_count,
    open_issues_count: repo.open_issues_count,
    subscribers_count: repo.subscribers_count,
    network_count: repo.network_count,
    size: repo.size,
    description: repo.description,
    default_branch: repo.default_branch,
  });

export const useGithubSync = (syncRepositories) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncError, setSyncError] = useState(null);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [totalRepos, setTotalRepos] = useState(0);
  const [completedRepos, setCompletedRepos] = useState(0);
  const [syncingCategories, setSyncingCategories] = useState(false);

  const syncCategories = useCallback(async () => {
    setSyncingCategories(true);
    try {
      const response = await api.post("/project-categories/sync/");
      console.log("Categories synced:", response.data);
      window.dispatchEvent(new Event(CATEGORIES_SYNCED_EVENT));
      return response.data;
    } catch (error) {
      console.warn("Failed to sync categories:", error);
      return null;
    } finally {
      setSyncingCategories(false);
    }
  }, []);

  const fetchContributorActivity = async (
    repoFullName,
    contributorLogin,
    githubToken,
  ) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const since = thirtyDaysAgo.toISOString();

      const { commits, failed: commitsFailed } = await fetchAllCommitsForAuthor(
        repoFullName,
        contributorLogin,
        githubToken,
      );

      if (commitsFailed) {
        console.warn(
          `Failed to fetch commits for ${contributorLogin} in ${repoFullName}`,
        );
        return { data: null, failed: true };
      }

      const prUrl = `https://api.github.com/repos/${repoFullName}/pulls?state=all&per_page=100`;
      const prResponse = await fetchWithRetry(prUrl, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const allPulls = prResponse.ok ? await prResponse.json() : [];
      const pulls = allPulls.filter(
        (pr) =>
          pr.user &&
          pr.user.login.toLowerCase() === contributorLogin.toLowerCase() &&
          new Date(pr.created_at) >= thirtyDaysAgo,
      );

      const issuesUrl = `https://api.github.com/repos/${repoFullName}/issues?state=all&creator=${contributorLogin}&since=${since}&per_page=100`;
      const issuesResponse = await fetchWithRetry(issuesUrl, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const rawIssues = issuesResponse.ok ? await issuesResponse.json() : [];
      const issues = rawIssues.filter((issue) => !issue.pull_request);

      let additions = 0;
      let deletions = 0;

      const recentCommitsForStats = commits.slice(0, 20);
      for (const commit of recentCommitsForStats) {
        try {
          const detailUrl = `https://api.github.com/repos/${repoFullName}/commits/${commit.sha}`;
          const detailResponse = await fetchWithRetry(detailUrl, {
            headers: { Authorization: `token ${githubToken}` },
          });
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            if (detail.stats) {
              additions += detail.stats.additions || 0;
              deletions += detail.stats.deletions || 0;
            }
          }
        } catch (e) {
          // Skip if we can't get commit details
        }
      }

      let reviewCount = 0;
      for (const pr of pulls.slice(0, 10)) {
        try {
          const reviewUrl = `https://api.github.com/repos/${repoFullName}/pulls/${pr.number}/reviews`;
          const reviewResponse = await fetchWithRetry(reviewUrl, {
            headers: { Authorization: `token ${githubToken}` },
          });
          if (reviewResponse.ok) {
            const reviews = await reviewResponse.json();
            const userReviews = reviews.filter(
              (r) =>
                r.user &&
                r.user.login.toLowerCase() === contributorLogin.toLowerCase(),
            );
            reviewCount += userReviews.length;
          }
        } catch (e) {
          // Skip if we can't get reviews
        }
      }

      const recentCommitDetails = commits.slice(0, 100).map((commit) => ({
        sha: commit.sha.substring(0, 7),
        message: (commit.commit?.message || "").split("\n")[0].slice(0, 120),
        date: commit.commit?.author?.date || null,
        url: commit.html_url,
      }));

      const now = new Date();
      return {
        data: {
          period_start: thirtyDaysAgo.toISOString(),
          period_end: now.toISOString(),
          commits: commits.length,
          pull_requests: pulls.length,
          reviews: reviewCount,
          issues: issues.length,
          additions: additions,
          deletions: deletions,
          recentCommits: recentCommitDetails,
        },
        failed: false,
      };
    } catch (error) {
      console.error(`Failed to fetch activity for ${contributorLogin}:`, error);
      return { data: null, failed: true };
    }
  };

  const syncSingleRepository = useCallback(
    async (repo, onProgress, options = {}) => {
      const { syncContributors = true, currentUsername = null } = options;
      const githubToken = localStorage.getItem("github_token");

      if (!githubToken) {
        throw new Error("Please connect your GitHub account first");
      }

      const freshRepos = await repositoryService.getRepositories({});
      const backendRepos = freshRepos.results || freshRepos;
      const backendRepo = backendRepos.find(
        (r) => r.full_name === repo.full_name,
      );

      if (!backendRepo) {
        throw new Error(`Repository ${repo.full_name} not found in backend`);
      }

      setCurrentRepo(repo.full_name);
      if (onProgress) onProgress(`Processing ${repo.full_name}...`);

      let repoLanguages = [];

      try {
        if (onProgress)
          onProgress(`Syncing languages for ${repo.full_name}...`);
        try {
          const langResponse = await fetchWithRetry(
            `https://api.github.com/repos/${repo.full_name}/languages`,
            { headers: { Authorization: `token ${githubToken}` } },
          );
          if (langResponse.ok) {
            const langBytes = await langResponse.json();
            const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
            if (total > 0) {
              repoLanguages = Object.entries(langBytes).map(
                ([language, bytes]) => ({
                  language,
                  bytes,
                  percentage: (bytes / total) * 100,
                }),
              );
              await languageService.bulkUpdateLanguages(
                backendRepo.id,
                repoLanguages,
              );
            }
          }
        } catch (langErr) {
          console.error(
            `Failed to sync languages for ${repo.full_name}:`,
            langErr,
          );
        }

        if (onProgress) onProgress(`Syncing stats for ${repo.full_name}...`);
        try {
          const statsData = {
            repository_id: backendRepo.id,
            stats: {
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
              watchers: repo.watchers_count || 0,
              open_issues: repo.open_issues_count || 0,
              subscribers: repo.subscribers_count || 0,
              network: repo.network_count || repo.forks_count || 0,
              size: repo.size || 0,
              default_branch: repo.default_branch || "main",
              description: repo.description || "",
              language: repo.language || "",
            },
          };
          await analyticsService.bulkCreateStats({
            repositories: [statsData],
          });
        } catch (statsErr) {
          console.error(
            `Failed to sync stats for ${repo.full_name}:`,
            statsErr,
          );
        }

        let failedActivityCount = 0;

        if (syncContributors) {
          if (onProgress)
            onProgress(`Fetching contributors for ${repo.full_name}...`);

          const contributorsUrl = `https://api.github.com/repos/${repo.full_name}/contributors?per_page=100`;
          const contributorsResponse = await fetchWithRetry(contributorsUrl, {
            headers: { Authorization: `token ${githubToken}` },
          });

          if (!contributorsResponse.ok) {
            throw new Error(
              `Failed to fetch contributors: ${contributorsResponse.status}`,
            );
          }

          const contributorsData = await contributorsResponse.json();

          if (contributorsData && contributorsData.length > 0) {
            const processedContributors = [];
            const contributorActivities = [];

            const contributorsToProcess = contributorsData.slice(0, 20);

            for (let i = 0; i < contributorsToProcess.length; i++) {
              const contributor = contributorsToProcess[i];

              if (onProgress) {
                onProgress(
                  `Processing ${contributor.login} (${i + 1}/${contributorsToProcess.length})...`,
                );
              }

              const isCurrentUser =
                currentUsername &&
                contributor.login.toLowerCase() ===
                  currentUsername.toLowerCase();

              let activityData = null;
              if (isCurrentUser) {
                const { data, failed } = await fetchContributorActivity(
                  repo.full_name,
                  contributor.login,
                  githubToken,
                );
                activityData = data;
                if (failed) failedActivityCount += 1;
              }

              const contributorPayload = {
                id: contributor.id,
                login: contributor.login,
                avatar_url: contributor.avatar_url,
                html_url: contributor.html_url,
                contributions: contributor.contributions,
                languages: repoLanguages,
              };
              if (activityData?.recentCommits) {
                contributorPayload.recent_commits = activityData.recentCommits;
              }
              processedContributors.push(contributorPayload);

              if (activityData) {
                contributorActivities.push({
                  github_id: contributor.id,
                  activity: activityData,
                });
              }

              if (isCurrentUser) {
                await sleep(250);
              }
            }

            if (processedContributors.length > 0) {
              if (onProgress) onProgress(`Saving contributors to database...`);

              await contributorService.bulkCreateContributors(
                backendRepo.id,
                processedContributors,
              );

              const backendContributors =
                await contributorService.getContributors({
                  repository: backendRepo.id,
                });

              const contributorMap = {};
              (backendContributors.results || backendContributors).forEach(
                (c) => {
                  contributorMap[c.github_id] = c.id;
                },
              );

              const activities = contributorActivities
                .map((item) => {
                  const contributorId = contributorMap[item.github_id];
                  if (!contributorId) return null;
                  return {
                    repository_contributor_id: contributorId,
                    period_start: item.activity.period_start,
                    period_end: item.activity.period_end,
                    commits: item.activity.commits,
                    pull_requests: item.activity.pull_requests,
                    reviews: item.activity.reviews || 0,
                    issues: item.activity.issues,
                    additions: item.activity.additions || 0,
                    deletions: item.activity.deletions || 0,
                  };
                })
                .filter(Boolean);

              if (activities.length > 0) {
                if (onProgress)
                  onProgress(`Saving ${activities.length} activity records...`);
                await analyticsService.bulkCreateContributorActivities({
                  activities: activities,
                });
              }

              if (onProgress) {
                const failureNote =
                  failedActivityCount > 0 ?
                    ` (${failedActivityCount} contributor${failedActivityCount > 1 ? "s" : ""} hit rate limits — retry sync to fill in the rest)`
                  : "";
                onProgress(
                  `Synced ${processedContributors.length} contributors and ${activities.length} activity records${failureNote}`,
                );
              }
            }
          } else {
            if (onProgress)
              onProgress(`No contributors found for ${repo.full_name}`);
          }

          window.dispatchEvent(new Event(CONTRIBUTORS_SYNCED_EVENT));
          window.dispatchEvent(new Event(CONTRIBUTOR_ACTIVITY_SYNCED_EVENT));
        } else {
          if (onProgress) onProgress(`Synced ${repo.full_name}`);
        }

        return {
          success: true,
          repo: repo.full_name,
          partialFailure: failedActivityCount > 0,
          failedCount: failedActivityCount,
        };
      } catch (error) {
        console.error(`Failed to sync ${repo.full_name}:`, error);
        throw error;
      } finally {
        setCurrentRepo(null);
      }
    },
    [],
  );

  const runSync = useCallback(
    async (options = {}) => {
      const {
        syncContributors = true,
        forceFull = false,
        currentUsername = null,
        syncCategories: shouldSyncCategories = true,
      } = options;
      setSyncError(null);
      setSyncing(true);
      setCompletedRepos(0);

      const githubToken = localStorage.getItem("github_token");

      if (!githubToken) {
        const message = "Please connect your GitHub account first";
        setSyncError(message);
        setSyncing(false);
        return { success: false, error: message };
      }

      try {
        let updateLogId = null;
        try {
          const log = await analyticsService.createUpdateLog({
            update_type: "MANUAL",
            status: "IN_PROGRESS",
          });
          updateLogId = log.id;
        } catch (logError) {
          console.warn("Failed to create update log:", logError);
        }

        setSyncMessage("Fetching repositories from GitHub...");
        const githubRepos =
          await githubService.fetchUserRepositories(githubToken);

        if (!githubRepos || githubRepos.length === 0) {
          const message = "No repositories found on your GitHub account";
          setSyncError(message);
          if (updateLogId) {
            await analyticsService.failUpdateLog(updateLogId, message);
          }
          return { success: false, error: message };
        }

        setTotalRepos(githubRepos.length);

        setSyncMessage(`Syncing ${githubRepos.length} repositories...`);
        const reposToSync = githubRepos.map((repo) =>
          githubService.transformRepoData(repo),
        );
        await syncRepositories(reposToSync);

        const syncMeta = forceFull ? {} : loadSyncMeta();

        let totalFailedActivity = 0;
        let skippedCount = 0;
        let incompleteCount = 0;

        for (let i = 0; i < githubRepos.length; i++) {
          const repo = githubRepos[i];
          const fingerprint = buildRepoFingerprint(repo);
          const previous = syncMeta[repo.full_name];
          const unchanged =
            !forceFull && previous && previous.fingerprint === fingerprint;

          if (unchanged) {
            skippedCount += 1;
            setSyncMessage(
              `Skipping ${repo.full_name} (no changes since last sync)...`,
            );
            setCompletedRepos(i + 1);
            continue;
          }

          try {
            const result = await syncSingleRepository(
              repo,
              (msg) => setSyncMessage(msg),
              { syncContributors, currentUsername },
            );
            if (result?.failedCount) totalFailedActivity += result.failedCount;

            if (result?.partialFailure) {
              incompleteCount += 1;
              delete syncMeta[repo.full_name];
            } else {
              syncMeta[repo.full_name] = {
                fingerprint,
                syncedAt: new Date().toISOString(),
              };
            }
            saveSyncMeta(syncMeta);

            setCompletedRepos(i + 1);
          } catch (err) {
            console.error(`Failed to sync ${repo.full_name}:`, err);
            setSyncMessage(`Failed to sync ${repo.full_name}: ${err.message}`);
            delete syncMeta[repo.full_name];
            saveSyncMeta(syncMeta);
          }
        }

        if (updateLogId) {
          try {
            await analyticsService.completeUpdateLog(updateLogId);
          } catch (completeErr) {
            console.warn("Failed to complete update log:", completeErr);
          }
        }

        window.dispatchEvent(new Event(LANGUAGES_SYNCED_EVENT));
        window.dispatchEvent(new Event(ANALYTICS_SYNCED_EVENT));
        if (syncContributors) {
          window.dispatchEvent(new Event(CONTRIBUTORS_SYNCED_EVENT));
          window.dispatchEvent(new Event(CONTRIBUTOR_ACTIVITY_SYNCED_EVENT));
        }

        const skipNote =
          skippedCount > 0 ?
            ` (${skippedCount} unchanged repo${skippedCount > 1 ? "s" : ""} skipped)`
          : "";
        const failureNote =
          totalFailedActivity > 0 ?
            ` (${totalFailedActivity} contributor activity fetches hit rate limits — ${incompleteCount} repo${incompleteCount > 1 ? "s" : ""} will retry automatically on next sync)`
          : "";
        setSyncMessage(
          `Successfully synced ${githubRepos.length} repositories${skipNote}${failureNote}`,
        );

        // Auto-sync categories after repositories are synced
        let categoriesResult = null;
        if (shouldSyncCategories) {
          setSyncMessage("Syncing categories...");
          categoriesResult = await syncCategories();
          if (categoriesResult) {
            setSyncMessage(
              `Successfully synced ${githubRepos.length} repositories and ${categoriesResult.count} categories`,
            );
          }
        }

        return {
          success: true,
          partialFailure: totalFailedActivity > 0,
          skippedCount,
          categoriesSynced: categoriesResult?.count || 0,
        };
      } catch (err) {
        console.error("Sync failed:", err);
        const message =
          err.response?.data?.detail ||
          err.message ||
          "Failed to sync repositories";
        setSyncError(message);

        try {
          const logs = await analyticsService.getUpdateLogs();
          if (logs && logs.length > 0) {
            const latestLog = logs[0];
            if (latestLog.status === "IN_PROGRESS") {
              await analyticsService.failUpdateLog(latestLog.id, message);
            }
          }
        } catch (logErr) {
          console.warn("Failed to mark update as failed:", logErr);
        }

        return { success: false, error: message };
      } finally {
        setSyncing(false);
        setCurrentRepo(null);
      }
    },
    [syncRepositories, syncSingleRepository, syncCategories],
  );

  return {
    runSync,
    syncSingleRepository,
    syncing,
    syncMessage,
    syncError,
    currentRepo,
    totalRepos,
    completedRepos,
    syncingCategories,
    syncCategories,
  };
};
