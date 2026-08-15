// components/repositories/RepositoryList.jsx
import React, { useState, useEffect } from "react";
import { RepositoryCard } from "./RepositoryCard";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { FaSearch, FaFilter, FaSync, FaFolderOpen } from "react-icons/fa";

export const RepositoryList = ({
  repositories,
  loading,
  error,
  onSync,
  onFilterChange,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  // Update searchTerm when filters change externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange?.({ ...filters, search: searchTerm || undefined });
  };

  const handleFilterChange = (key, value) => {
    const newValue = value || undefined;
    onFilterChange?.({ ...filters, [key]: newValue });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFilterChange?.({});
  };

  // Check if there are filters applied
  const hasActiveFilters =
    !!filters.search ||
    !!filters.visibility ||
    filters.archived === "true" ||
    filters.archived === "false" ||
    !!filters.ordering;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400 text-sm md:text-base">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Check if there are any repositories with data
  const hasRepositories = repositories && repositories.length > 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and Filter Bar - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary text-sm md:text-base"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 text-xs md:text-sm" />
          </div>
        </form>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm px-3 md:px-4 py-1.5 md:py-2">
            <FaFilter className="mr-1 md:mr-2 text-xs md:text-sm" />
            <span className="hidden xs:inline">Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={onSync}
            disabled={loading}
            className="text-sm px-3 md:px-4 py-1.5 md:py-2">
            <FaSync
              className={`mr-1 md:mr-2 text-xs md:text-sm ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">Sync</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel - Responsive with dark dropdowns */}
      {showFilters && (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <select
                value={filters.visibility || ""}
                onChange={(e) =>
                  handleFilterChange("visibility", e.target.value || undefined)
                }
                className="w-full bg-dark/90 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm cursor-pointer hover:border-white/30 transition-colors">
                <option value="">All Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filters.archived || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange("archived", value || undefined);
                }}
                className="w-full bg-dark/90 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm cursor-pointer hover:border-white/30 transition-colors">
                <option value="">All Status</option>
                <option value="false">Active</option>
                <option value="true">Archived</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filters.ordering || ""}
                onChange={(e) =>
                  handleFilterChange("ordering", e.target.value || undefined)
                }
                className="w-full bg-dark/90 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm cursor-pointer hover:border-white/30 transition-colors">
                <option value="">Sort by</option>
                <option value="-stars">Most Stars</option>
                <option value="stars">Least Stars</option>
                <option value="-forks">Most Forks</option>
                <option value="forks">Least Forks</option>
                <option value="-updated_at_github">Recently Updated</option>
                <option value="updated_at_github">Oldest Updated</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 md:mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Repository Grid - Show empty state if no repositories */}
      {!hasRepositories ?
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 md:p-12 text-center border border-white/10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FaFolderOpen className="w-10 h-10 md:w-14 md:h-14 text-primary/60" />
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            {hasActiveFilters ?
              "No Matching Repositories"
            : "No Repositories Found"}
          </h3>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto mb-4">
            {hasActiveFilters ?
              "Try adjusting your search or filters to find what you're looking for."
            : "Sync your GitHub repositories to get started tracking your projects."
            }
          </p>
          {!hasActiveFilters && (
            <Button
              onClick={onSync}
              className="flex items-center gap-2 mx-auto bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary">
              <FaSync className="w-4 h-4" />
              Sync Repositories
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mx-auto">
              Clear Filters
            </Button>
          )}
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      }
    </div>
  );
};
