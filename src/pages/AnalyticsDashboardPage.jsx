// pages/AnalyticsDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Button } from "../components/common/Button";
import {
  FaChartLine,
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaDatabase,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaInbox,
} from "react-icons/fa";
import { useAnalytics } from "../hooks/useAnalytics";

export const AnalyticsDashboardPage = () => {
  const {
    summary,
    repositoryStats,
    userStats,
    updateLogs,
    loading,
    error,
    fetchSummary,
    fetchRepositoryStats,
    fetchUserStats,
    fetchUpdateLogs,
  } = useAnalytics();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchSummary(),
        fetchRepositoryStats(),
        fetchUserStats(),
        fetchUpdateLogs(),
      ]);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <FaCheckCircle className="text-green-400" />;
      case "FAILED":
        return <FaTimesCircle className="text-red-400" />;
      case "IN_PROGRESS":
        return <FaSync className="text-blue-400 animate-spin" />;
      default:
        return <FaClock className="text-yellow-400" />;
    }
  };

  if (loading && !refreshing) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Check if the repo has actual stars/forks (greater than 0)
  const hasStarredRepo =
    summary?.most_starred_repo && summary.most_starred_repo.stars > 0;
  const hasForkedRepo =
    summary?.most_forked_repo && summary.most_forked_repo.forks > 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <FaChartLine className="text-secondary" />
              Analytics Dashboard
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Detailed statistics and insights from your repositories
            </p>
          </div>
          <Button
            onClick={loadAllData}
            disabled={refreshing}
            className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary w-full sm:w-auto">
            <FaSync className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error loading analytics: {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <FaDatabase className="w-5 h-5 text-primary" />
              <h3 className="text-white/60 text-sm font-medium">Total Repos</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {summary?.total_repositories || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white/60 text-sm font-medium">Total Stars</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {summary?.total_stars || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <FaCodeBranch className="w-5 h-5 text-blue-400" />
              <h3 className="text-white/60 text-sm font-medium">Total Forks</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {summary?.total_forks || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="w-5 h-5 text-secondary" />
              <h3 className="text-white/60 text-sm font-medium">Languages</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {summary?.language_distribution ?
                Object.keys(summary.language_distribution).length
              : 0}
            </p>
          </div>
        </div>

        {/* Language Distribution & Most Starred/Forked - Equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Language Distribution - Left Column */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">
              Language Distribution
            </h3>
            <div className="flex-1 overflow-y-auto">
              {(
                summary?.language_distribution &&
                Object.keys(summary.language_distribution).length > 0
              ) ?
                <div className="space-y-3">
                  {Object.entries(summary.language_distribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([language, count]) => {
                      const total = Object.values(
                        summary.language_distribution,
                      ).reduce((a, b) => a + b, 0);
                      const percentage = (count / total) * 100;

                      return (
                        <div key={language} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">
                              {language || "Unknown"}
                            </span>
                            <span className="text-white/60">
                              {count} repos ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              : <p className="text-white/40 text-center py-8">
                  No language data available
                </p>
              }
            </div>
          </div>

          {/* Most Starred & Forked - Right Column */}
          <div className="flex flex-col gap-4">
            {/* Most Starred Repository */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 flex-1">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                Most Starred Repository
              </h3>
              {hasStarredRepo ?
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white font-medium text-lg">
                    {summary.most_starred_repo.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {summary.most_starred_repo.full_name}
                  </p>
                  <p className="text-yellow-400 mt-2">
                    ⭐ {summary.most_starred_repo.stars} stars
                  </p>
                </div>
              : <div className="bg-white/5 rounded-xl p-6 text-center">
                  <FaInbox className="text-4xl text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No starred repositories found
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    Stars will appear here once repositories have been starred
                  </p>
                </div>
              }
            </div>

            {/* Most Forked Repository */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 flex-1">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <FaCodeBranch className="text-blue-400" />
                Most Forked Repository
              </h3>
              {hasForkedRepo ?
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white font-medium text-lg">
                    {summary.most_forked_repo.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {summary.most_forked_repo.full_name}
                  </p>
                  <p className="text-blue-400 mt-2">
                    🔀 {summary.most_forked_repo.forks} forks
                  </p>
                </div>
              : <div className="bg-white/5 rounded-xl p-6 text-center">
                  <FaInbox className="text-4xl text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No forked repositories found
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    Forks will appear here once repositories have been forked
                  </p>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Update Logs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FaSync className="text-secondary" />
            Recent Update Logs
          </h3>

          {updateLogs && updateLogs.length > 0 ?
            <div className="space-y-3">
              {updateLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-xl gap-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="text-white font-medium text-sm">
                        {log.update_type} Update
                      </p>
                      <p className="text-white/60 text-xs">
                        {new Date(log.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {log.repository_name && (
                      <span className="text-white/60">
                        Repo: {log.repository_name}
                      </span>
                    )}
                    {log.repositories_updated > 0 && (
                      <span className="text-green-400">
                        {log.repositories_updated} repos updated
                      </span>
                    )}
                    {log.status === "FAILED" && log.error_message && (
                      <span className="text-red-400 text-xs truncate max-w-[200px]">
                        Error: {log.error_message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          : <p className="text-white/40 text-center py-8">
              No update logs available
            </p>
          }
        </div>

        {/* Last Updated */}
        {summary?.last_updated && (
          <div className="mt-4 text-center text-white/40 text-sm">
            Data last updated: {new Date(summary.last_updated).toLocaleString()}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
