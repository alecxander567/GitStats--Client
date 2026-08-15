import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useContributors } from "../hooks/useContributors";
import { useContributorActivity } from "../hooks/useContributorActivity";
import { useGithubSync } from "../hooks/useGithubSync";
import { useRepositories } from "../hooks/useRepositories";
import { useAlert } from "../contexts/AlertContext";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getLanguageIcon, getLanguageColor } from "../utils/languageIcons";
import { Button } from "../components/common/Button";
import {
  FaUsers,
  FaSearch,
  FaGithub,
  FaUser,
  FaCodeBranch,
  FaInbox,
  FaCode,
  FaCommentDots,
  FaBug,
  FaPlus,
  FaMinus,
  FaStar,
  FaClock,
  FaChartLine,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

export const ContributorsPage = () => {
  const { showAlert } = useAlert();
  const {
    contributors,
    topContributors,
    loading,
    error,
    selectedContributor,
    contributorLanguages,
    fetchContributors,
    fetchTopContributors,
    selectContributor,
  } = useContributors();

  const {
    activities,
    summary: contributorSummary,
    topContributors: topActivityContributors,
    loading: activityLoading,
    fetchSummary: fetchContributorSummary,
    fetchTopContributors: fetchTopActivityContributors,
    fetchActivities,
  } = useContributorActivity();

  const { syncSingleRepository } = useGithubSync();
  const {
    repositories,
    fetchRepositories,
    loading: reposLoading,
  } = useRepositories();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContributors, setFilteredContributors] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [syncingRepoId, setSyncingRepoId] = useState(null);
  const [syncProgress, setSyncProgress] = useState("");

  // Searchable dropdown states
  const [repoSearchTerm, setRepoSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadAllData();
    fetchRepositories();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        fetchContributors(),
        fetchTopContributors(10),
        fetchContributorSummary(),
        fetchTopActivityContributors(10),
        fetchActivities({ days: 30 }),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
      showAlert("Failed to load contributor data");
    }
  };

  // Filter contributors by repository name
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredContributors(contributors);
    } else {
      const filtered = contributors.filter((contributor) =>
        contributor.repository_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      setFilteredContributors(filtered);
    }
  }, [searchTerm, contributors]);

  // Filter repositories for dropdown
  useEffect(() => {
    if (repoSearchTerm.trim() === "") {
      setFilteredRepos(repositories || []);
    } else {
      const filtered = (repositories || []).filter((repo) =>
        repo.full_name.toLowerCase().includes(repoSearchTerm.toLowerCase()),
      );
      setFilteredRepos(filtered);
    }
  }, [repoSearchTerm, repositories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectContributor = async (contributor) => {
    selectContributor(contributor);
  };

  const handleSelectRepository = (repoId, repoName) => {
    setSelectedRepoId(repoId);
    setRepoSearchTerm(repoName);
    setIsDropdownOpen(false);
  };

  const handleSyncRepository = async () => {
    if (!selectedRepoId) {
      showAlert("Please select a repository");
      return;
    }

    const repo = repositories.find((r) => r.id === parseInt(selectedRepoId));
    if (!repo) {
      showAlert("Repository not found");
      return;
    }

    setSyncingRepoId(repo.id);
    setSyncProgress(`Starting sync for ${repo.full_name}...`);

    try {
      const result = await syncSingleRepository(repo, (progress) => {
        setSyncProgress(progress);
      });

      if (result && result.success) {
        showAlert(`Successfully synced ${repo.full_name}`);
        await loadAllData();
      } else {
        showAlert(`Failed to sync ${repo.full_name}`);
      }
    } catch (err) {
      console.error("Sync error:", err);
      showAlert(err.message || "Sync failed");
    } finally {
      setSyncingRepoId(null);
      setSyncProgress("");
    }
  };

  if (loading && !contributors.length) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          Error loading contributors: {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaUsers className="text-secondary" />
            Contributors
          </h1>
          <p className="text-white/60 mt-1">
            {contributors.length} contributors across your repositories
          </p>
        </div>

        {/* Sync Repository Section with Searchable Dropdown */}
        <div className="relative z-20 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto relative" ref={dropdownRef}>
              <label className="text-white/60 text-sm block mb-1">
                Select Repository to Sync Contributors
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={repoSearchTerm}
                  onChange={(e) => {
                    setRepoSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  disabled={!!syncingRepoId || reposLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={!!syncingRepoId || reposLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50">
                  {repoSearchTerm ?
                    <FaTimes
                      onClick={(e) => {
                        e.stopPropagation();
                        setRepoSearchTerm("");
                        setSelectedRepoId("");
                        setIsDropdownOpen(false);
                      }}
                    />
                  : <FaChevronDown />}
                </button>
              </div>

              {/* Dropdown - solid, fully opaque background */}
              {isDropdownOpen && !syncingRepoId && !reposLoading && (
                <div className="absolute z-50 w-full mt-1 bg-[#14141f] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredRepos.length === 0 ?
                    <div className="px-4 py-3 text-white/40 text-sm">
                      No repositories found
                    </div>
                  : filteredRepos.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() =>
                          handleSelectRepository(repo.id, repo.full_name)
                        }
                        className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors text-sm ${
                          selectedRepoId === String(repo.id) ?
                            "bg-primary/20 text-primary"
                          : "text-white/80 hover:text-white"
                        }`}>
                        {repo.full_name}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
            <Button
              onClick={handleSyncRepository}
              disabled={!!syncingRepoId || !selectedRepoId || reposLoading}
              className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary mt-1 sm:mt-0">
              {syncingRepoId ?
                <>
                  <FaSpinner className="animate-spin" />
                  Syncing...
                </>
              : <>
                  <FaSync />
                  Sync Contributors
                </>
              }
            </Button>
          </div>

          {/* Sync Progress */}
          {syncProgress && (
            <div className="mt-3 text-white/60 text-sm flex items-center gap-2">
              <FaSpinner className="animate-spin text-primary" />
              {syncProgress}
            </div>
          )}
        </div>

        {/* Search Bar - Search by repository name */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by repository name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Top Contributors Section */}
        {topContributors && topContributors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">
              Top Contributors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {topContributors.slice(0, 5).map((contributor) => (
                <div
                  key={contributor.id}
                  onClick={() => handleSelectContributor(contributor)}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer text-center group">
                  <img
                    src={
                      contributor.avatar_url ||
                      `https://ui-avatars.com/api/?name=${contributor.login}&background=6C63FF&color=fff&size=64`
                    }
                    alt={contributor.login}
                    className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white/20 group-hover:border-primary transition-all"
                  />
                  <p className="text-white font-medium text-sm truncate">
                    {contributor.login}
                  </p>
                  <p className="text-white/40 text-xs">
                    {contributor.contributions} contributions
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Contributors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contributors List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">
              All Contributors
            </h2>
            {filteredContributors.length === 0 ?
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
                <FaInbox className="text-4xl text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No contributors found</p>
                <p className="text-white/20 text-sm mt-1">
                  {searchTerm ?
                    "Try a different search term"
                  : "Sync your repositories to see contributors"}
                </p>
              </div>
            : <div className="space-y-3">
                {filteredContributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    onClick={() => handleSelectContributor(contributor)}
                    className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer hover:bg-white/10 ${
                      selectedContributor?.id === contributor.id ?
                        "border-primary/50 bg-white/10"
                      : "border-white/10 hover:border-white/20"
                    }`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          contributor.avatar_url ||
                          `https://ui-avatars.com/api/?name=${contributor.login}&background=6C63FF&color=fff&size=64`
                        }
                        alt={contributor.login}
                        className="w-12 h-12 rounded-full border-2 border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">
                            {contributor.login}
                          </p>
                          <a
                            href={contributor.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}>
                            <FaGithub className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-white/60 text-sm truncate">
                          {contributor.repository_name} •{" "}
                          {contributor.contributions} contributions
                        </p>
                      </div>
                      <div className="text-white/40 text-sm flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <FaCodeBranch className="w-3 h-3" />
                          {contributor.languages?.length || 0} languages
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Contributor Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 sticky top-4">
              <h2 className="text-lg font-bold text-white mb-4">
                Contributor Details
              </h2>
              {selectedContributor ?
                <>
                  <div className="text-center mb-4">
                    <img
                      src={
                        selectedContributor.avatar_url ||
                        `https://ui-avatars.com/api/?name=${selectedContributor.login}&background=6C63FF&color=fff&size=128`
                      }
                      alt={selectedContributor.login}
                      className="w-20 h-20 rounded-full mx-auto border-2 border-primary mb-3"
                    />
                    <h3 className="text-white font-bold text-lg">
                      {selectedContributor.login}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {selectedContributor.repository_name}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <FaCodeBranch className="w-3 h-3" />
                        {selectedContributor.contributions} contributions
                      </span>
                    </div>
                  </div>

                  {/* Recent Commits Section */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <h4 className="text-white/60 text-sm mb-3 flex items-center gap-2">
                      <FaCode className="text-secondary" />
                      Recent Commits
                    </h4>
                    {(
                      selectedContributor.recent_commits &&
                      selectedContributor.recent_commits.length > 0
                    ) ?
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {selectedContributor.recent_commits.map((commit) => (
                          <a
                            key={commit.sha}
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors">
                            <p className="text-white text-sm truncate">
                              {commit.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                              <span className="font-mono">{commit.sha}</span>
                              {commit.date && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {new Date(commit.date).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    : <div className="bg-white/5 rounded-lg p-4 text-center">
                        <p className="text-white/40 text-sm">
                          No recent commits synced yet
                        </p>
                        <p className="text-white/20 text-xs mt-1">
                          Use the "Sync Contributors" button above to collect
                          commit data
                        </p>
                      </div>
                    }
                  </div>

                  {/* Languages */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white/60 text-sm mb-3">Languages</h4>
                    {contributorLanguages.length === 0 ?
                      <p className="text-white/40 text-sm text-center py-4">
                        No language data available
                      </p>
                    : <div className="space-y-3">
                        {contributorLanguages.map((lang) => {
                          return (
                            <div
                              key={lang.id}
                              className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getLanguageColor(
                                    lang.language,
                                  )} flex items-center justify-center flex-shrink-0`}>
                                  {getLanguageIcon(lang.language, "text-2xl")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm truncate">
                                    {lang.language}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-white/60">
                                    <span>
                                      {(lang.bytes / 1024).toFixed(1)} KB
                                    </span>
                                    <span className="text-white/20">•</span>
                                    <span>{lang.percentage}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`bg-gradient-to-r ${getLanguageColor(
                                    lang.language,
                                  ).replace(
                                    "/20",
                                    "",
                                  )} h-1.5 rounded-full transition-all duration-500`}
                                  style={{ width: `${lang.percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    }
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <a
                      href={selectedContributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm">
                      <FaGithub />
                      View GitHub Profile
                    </a>
                  </div>
                </>
              : <div className="text-center py-8">
                  <FaUser className="text-4xl text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">Select a contributor</p>
                  <p className="text-white/20 text-sm mt-1">
                    Click on any contributor to view their details
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
