import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import { useRepositories } from "../hooks/useRepositories";
import { useRepositoryStats } from "../hooks/useRepositoryStats";
import { useGithubSync } from "../hooks/useGithubSync";
import { useCommunities } from "../hooks/useCommunities";
import { CommitActivityChart } from "../components/dashboard/CommitActivityChart";
import { RepositoryStats } from "../components/repositories/RepositoryStats";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaUsers,
  FaStar,
  FaCodeBranch,
  FaSync,
  FaUserFriends,
  FaUserPlus,
  FaPython,
  FaJs,
  FaReact,
  FaJava,
  FaPhp,
  FaRust,
  FaSwift,
  FaGem,
  FaCuttlefish,
  FaHtml5,
  FaCss3Alt,
  FaVuejs,
  FaAngular,
  FaDocker,
  FaTerminal,
  FaCode,
  FaArrowRight,
  FaSpinner,
  FaFolderOpen,
} from "react-icons/fa";
import {
  SiTypescript,
  SiGo,
  SiRuby,
  SiKotlin,
  SiScala,
  SiPerl,
  SiLua,
  SiElixir,
  SiClojure,
  SiHaskell,
  SiJulia,
  SiR,
  SiDart,
  SiFlutter,
  SiSolidity,
  SiGraphql,
} from "react-icons/si";
import { getLanguageIcon as getLangIcon } from "../utils/languageIcons";

// Cache the GitHub login lookup per token so repeated syncs in the same
// session don't refetch it every time. Keyed by token so a re-auth with a
// different account (or a token change) invalidates it automatically.
let cachedGithubLogin = null;
let cachedGithubLoginToken = null;

const resolveGithubLogin = async (githubToken) => {
  if (!githubToken) return null;

  if (cachedGithubLogin && cachedGithubLoginToken === githubToken) {
    return cachedGithubLogin;
  }

  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${githubToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to resolve GitHub login (status ${response.status})`,
    );
  }

  const data = await response.json();
  cachedGithubLogin = data.login;
  cachedGithubLoginToken = githubToken;
  return data.login;
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [userCommunities, setUserCommunities] = useState([]);
  const [syncProgress, setSyncProgress] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const {
    repositories,
    loading: reposLoading,
    syncRepositories,
  } = useRepositories();

  const { stats, loading: statsLoading, fetchStats } = useRepositoryStats();

  const {
    runSync,
    syncing,
    syncMessage,
    syncError,
    currentRepo,
    totalRepos,
    completedRepos,
  } = useGithubSync(syncRepositories);

  const {
    communities,
    loading: communitiesLoading,
    fetchCommunities,
  } = useCommunities();

  // Fetch communities when component mounts
  useEffect(() => {
    fetchCommunities();
  }, []);

  // Filter communities created by the current user
  useEffect(() => {
    if (communities.length > 0 && user) {
      const userCreated = communities.filter(
        (community) => community.created_by === user.id,
      );
      setUserCommunities(userCreated);
    }
  }, [communities, user]);

  // Update progress when sync state changes
  useEffect(() => {
    if (syncing) {
      setShowProgress(true);
      setSyncProgress({
        message: syncMessage,
        current: completedRepos,
        total: totalRepos,
        currentRepo: currentRepo,
      });
    } else if (syncError) {
      setShowProgress(false);
      showAlert(syncError);
    } else if (syncMessage && !syncing) {
      setShowProgress(false);
      // Show success message if sync completed
      if (syncMessage.includes("Successfully synced")) {
        showAlert(syncMessage);
      }
    }
  }, [
    syncing,
    syncMessage,
    syncError,
    completedRepos,
    totalRepos,
    currentRepo,
    showAlert,
  ]);

  const handleConnectGitHub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri =
      import.meta.env.VITE_API_URL ?
        `${import.meta.env.VITE_API_URL.replace("/api", "")}/auth/github/callback`
      : "http://localhost:5173/auth/github/callback";
    const scope = "user repo read:org";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = githubAuthUrl;
  };

  const getLanguageIcon = (language) => {
    if (!language) return <FaCode className="text-white/40 w-3 h-3" />;

    const lang = language.toLowerCase();

    const icons = {
      python: <FaPython className="text-blue-400" />,
      javascript: <FaJs className="text-yellow-400" />,
      typescript: <SiTypescript className="text-blue-500" />,
      react: <FaReact className="text-cyan-400" />,
      vue: <FaVuejs className="text-green-400" />,
      angular: <FaAngular className="text-red-400" />,
      java: <FaJava className="text-red-500" />,
      php: <FaPhp className="text-purple-400" />,
      ruby: <FaGem className="text-red-400" />,
      go: <SiGo className="text-cyan-400" />,
      rust: <FaRust className="text-orange-400" />,
      swift: <FaSwift className="text-orange-500" />,
      kotlin: <SiKotlin className="text-purple-500" />,
      c: <FaCuttlefish className="text-blue-400" />,
      "c++": <FaCuttlefish className="text-blue-500" />,
      "c#": <FaCuttlefish className="text-purple-400" />,
      html: <FaHtml5 className="text-orange-500" />,
      css: <FaCss3Alt className="text-blue-400" />,
      dockerfile: <FaDocker className="text-blue-400" />,
      shell: <FaTerminal className="text-green-400" />,
      bash: <FaTerminal className="text-green-400" />,
      scala: <SiScala className="text-red-500" />,
      perl: <SiPerl className="text-blue-400" />,
      lua: <SiLua className="text-blue-500" />,
      elixir: <SiElixir className="text-purple-500" />,
      clojure: <SiClojure className="text-blue-500" />,
      haskell: <SiHaskell className="text-purple-500" />,
      julia: <SiJulia className="text-purple-500" />,
      r: <SiR className="text-blue-400" />,
      dart: <SiDart className="text-blue-500" />,
      flutter: <SiFlutter className="text-blue-400" />,
      solidity: <SiSolidity className="text-gray-400" />,
      graphql: <SiGraphql className="text-pink-400" />,
    };

    for (const [key, icon] of Object.entries(icons)) {
      if (lang.includes(key)) {
        return icon;
      }
    }

    return <FaCode className="text-white/40 w-3 h-3" />;
  };

  const handleSync = async () => {
    try {
      const currentUsername = await resolveGithubLogin(user.github_token);
      const { success } = await runSync({
        syncContributors: true,
        currentUsername,
      });
      if (success) {
        await fetchStats();
      }
    } catch (error) {
      showAlert(error.message || "Failed to sync repositories");
    }
  };

  const handleFullResync = async () => {
    try {
      const currentUsername = await resolveGithubLogin(user.github_token);
      const { success } = await runSync({
        syncContributors: true,
        currentUsername,
        forceFull: true,
      });
      if (success) {
        await fetchStats();
      }
    } catch (error) {
      showAlert(error.message || "Failed to perform full resync");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-darkest p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Welcome back, {user.display_name || user.username}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!user?.github_token && (
              <Button
                onClick={handleConnectGitHub}
                className="flex items-center justify-center gap-2 whitespace-nowrap bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                <FaGithub className="w-4 h-4" />
                Get GitHub Token
              </Button>
            )}
            <Button
              onClick={handleSync}
              disabled={syncing || reposLoading}
              className="flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary w-full sm:w-auto">
              <FaSync className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync Repositories"}
            </Button>
            <Button
              onClick={handleFullResync}
              disabled={syncing || reposLoading}
              variant="outline"
              title="Ignore the cache and resync every repository from scratch"
              className="flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto">
              Full Resync
            </Button>
          </div>
        </div>

        {/* Sync Progress Bar */}
        {showProgress && syncProgress && (
          <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <FaSpinner className="animate-spin text-primary w-5 h-5" />
              <span className="text-white font-medium">
                {syncProgress.message || "Syncing repositories..."}
              </span>
            </div>
            {syncProgress.currentRepo && (
              <p className="text-white/60 text-sm mb-2">
                Currently processing:{" "}
                <span className="text-white font-mono">
                  {syncProgress.currentRepo}
                </span>
              </p>
            )}
            {syncProgress.total > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Progress</span>
                  <span>
                    {syncProgress.current} / {syncProgress.total}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${syncProgress.total > 0 ? (syncProgress.current / syncProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <FaUsers className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <h3 className="text-white/60 text-xs md:text-sm font-medium">
                Followers
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {user.followers || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20 hover:border-secondary/50 transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <FaUsers className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              <h3 className="text-white/60 text-xs md:text-sm font-medium">
                Following
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {user.following || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20 hover:border-primary-light/50 transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <FaCodeBranch className="w-4 h-4 md:w-5 md:h-5 text-primary-light" />
              <h3 className="text-white/60 text-xs md:text-sm font-medium">
                Repositories
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats?.total_repos || repositories.length || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20 hover:border-yellow-400/50 transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <FaStar className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              <h3 className="text-white/60 text-xs md:text-sm font-medium">
                Stars Earned
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats?.total_stars || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <CommitActivityChart
            repositories={repositories}
            username={user.username}
            loading={reposLoading}
          />
          <RepositoryStats stats={stats} loading={statsLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Activity Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-3 md:mb-4">
              Recent Activity
            </h3>
            {repositories.length > 0 ?
              <div className="space-y-2 md:space-y-3">
                {repositories.slice(0, 5).map((repo) => (
                  <div
                    key={repo.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0">
                          {getLanguageIcon(repo.primary_language)}
                        </span>
                        <p className="text-white font-medium truncate text-sm md:text-base">
                          {repo.name}
                        </p>
                      </div>
                      <p className="text-white/60 text-xs md:text-sm truncate">
                        {repo.description || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 ml-0 sm:ml-4">
                      <span className="flex items-center gap-1 text-white/60 text-xs md:text-sm">
                        <FaStar className="text-yellow-400" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 text-white/60 text-xs md:text-sm">
                        <FaCodeBranch className="text-blue-400" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                ))}
                {repositories.length > 5 && (
                  <Link to="/repositories">
                    <Button variant="outline" className="w-full mt-2 text-sm">
                      View all {repositories.length} repositories
                    </Button>
                  </Link>
                )}
              </div>
            : <div className="text-white/40 text-center py-8 md:py-12">
                <div className="flex justify-center mb-4">
                  <FaFolderOpen className="text-5xl text-white/20" />
                </div>
                <p className="text-base md:text-lg font-medium text-white/60">
                  No repositories synced yet
                </p>
                <p className="text-xs md:text-sm mt-2">
                  Click "Sync Repositories" to get started
                </p>
              </div>
            }
          </div>

          {/* Communities Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaUserFriends className="text-primary" />
                Your Communities
              </h3>
              <Link to="/communities">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1">
                  View All
                  <FaArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            {communitiesLoading ?
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            : userCommunities.length > 0 ?
              <div className="space-y-2 md:space-y-3">
                {userCommunities.slice(0, 4).map((community) => (
                  <Link
                    key={community.id}
                    to={`/communities/${community.slug}`}
                    className="block p-3 md:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        {getLangIcon(community.language, "w-5 h-5")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                          {community.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>{community.language || "General"}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span className="flex items-center gap-1">
                            <FaUsers className="w-3 h-3" />
                            {community.member_count || 0}
                          </span>
                        </div>
                      </div>
                      <FaArrowRight className="text-white/20 group-hover:text-primary transition-colors w-4 h-4 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
                {userCommunities.length > 4 && (
                  <Link to="/communities">
                    <Button variant="outline" className="w-full mt-2 text-sm">
                      View all {userCommunities.length} communities
                    </Button>
                  </Link>
                )}
              </div>
            : <div className="text-center py-6 md:py-8">
                <div className="flex justify-center mb-3">
                  <FaUserFriends className="text-5xl text-white/20" />
                </div>
                <p className="text-white/60 text-sm md:text-base">
                  You haven't created any communities yet
                </p>
                <Link to="/communities">
                  <Button className="mt-3 text-sm flex items-center gap-2">
                    <FaUserPlus className="w-4 h-4" />
                    Create Your First Community
                  </Button>
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
