// pages/RepositoriesPage.jsx
import React from "react";
import { useRepositories } from "../hooks/useRepositories";
import { useGithubSync } from "../hooks/useGithubSync";
import { useAlert } from "../contexts/AlertContext";
import { RepositoryList } from "../components/repositories/RepositoryList";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { FaSync } from "react-icons/fa";

export const RepositoriesPage = () => {
  const { showAlert } = useAlert();
  const {
    repositories,
    loading,
    error,
    filters,
    fetchRepositories,
    syncRepositories,
    setFilters,
  } = useRepositories();

  const { runSync, syncing, syncError } = useGithubSync(syncRepositories);

  const handleSync = async () => {
    try {
      const { success, error: err } = await runSync();
      if (!success) {
        showAlert(err || "Failed to sync repositories");
        return;
      }
      await fetchRepositories();
      showAlert("Repositories synced successfully!");
    } catch (error) {
      showAlert(error.message || "Failed to sync repositories");
    }
  };

  // Show sync error if it occurs
  React.useEffect(() => {
    if (syncError) {
      showAlert(syncError);
    }
  }, [syncError, showAlert]);

  if (loading && repositories.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Repositories</h1>
            <p className="text-white/60">
              {repositories.length} repositories found
            </p>
          </div>
          <Button
            onClick={handleSync}
            disabled={loading || syncing}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary">
            <FaSync className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync"}
          </Button>
        </div>

        <RepositoryList
          repositories={repositories}
          loading={loading}
          error={error}
          filters={filters}
          onSync={handleSync}
          onFilterChange={setFilters}
        />
      </div>
    </DashboardLayout>
  );
};
