import React, { useState, useCallback, useEffect } from "react";
import { useProjectCategories } from "../hooks/useProjectCategories";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { CategoryBadge } from "../components/project-categories/CategoryBadge";
import { CategorySummary } from "../components/project-categories/CategorySummary";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import {
  FaSync,
  FaTimes,
  FaSearch,
  FaTags,
  FaList,
  FaThLarge,
  FaFilter,
} from "react-icons/fa";

export const ProjectCategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    filters,
    setFilters,
    getStats,
    fetchCategories,
  } = useProjectCategories();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStatsData = async () => {
      setStatsLoading(true);
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setLocalError("Failed to load statistics");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStatsData();
  }, [getStats]);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchCategories();
      setStatsLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setLocalError("Failed to refresh data");
    } finally {
      setStatsLoading(false);
    }
  }, [fetchCategories, getStats]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setSelectedCategory(null);
  }, [setFilters]);

  const handleCategoryClick = useCallback(
    (category) => {
      if (selectedCategory === category) {
        // If clicking the same category, clear the filter
        setSelectedCategory(null);
        setFilters((prev) => {
          const newFilters = { ...prev };
          delete newFilters.category;
          return newFilters;
        });
      } else {
        setSelectedCategory(category);
        setFilters((prev) => ({
          ...prev,
          category: category,
        }));
      }
    },
    [selectedCategory, setFilters],
  );

  // Filter categories by search term and category filter
  const filteredCategories = categories.filter((cat) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        cat.category?.toLowerCase().includes(search) ||
        cat.repository_name?.toLowerCase().includes(search) ||
        cat.repository_display_name?.toLowerCase().includes(search) ||
        cat.repository_username?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Category filter (already applied via filters, but we also check selectedCategory)
    if (selectedCategory && cat.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== "",
    ) ||
    searchTerm ||
    selectedCategory;

  // Display error from hook or local
  const displayError = error || localError;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FaTags className="text-primary w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Project Categories
              </h1>
            </div>
            <p className="text-white/60 text-sm mt-1">
              Automatically classified projects by technology stack
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              onClick={handleRefresh}
              disabled={loading || statsLoading}
              variant="outline"
              className="flex items-center gap-2">
              <FaSync
                className={`w-4 h-4 ${loading || statsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
            <span>{displayError}</span>
            <button
              onClick={() => {
                setLocalError(null);
                // Note: We can't clear the hook error directly
              }}
              className="text-red-400 hover:text-red-300">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Statistics Section with Clickable Categories */}
        {stats && (
          <div className="mb-6">
            <CategorySummary
              stats={stats}
              loading={statsLoading}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by repository name, category, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-white/40 focus:border-primary focus:outline-none"
            />
          </div>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap">
              <FaTimes className="w-3 h-3" />
              Clear Filters
            </Button>
          )}

          <div className="flex gap-1 bg-white/5 rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" ?
                  "bg-primary/20 text-primary"
                : "text-white/40 hover:text-white/60"
              }`}
              title="List View">
              <FaList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" ?
                  "bg-primary/20 text-primary"
                : "text-white/40 hover:text-white/60"
              }`}
              title="Grid View">
              <FaThLarge className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Badge */}
        {selectedCategory && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm">Filtering by:</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <FaFilter className="w-3 h-3" />
              {selectedCategory}
              <button
                onClick={() => handleCategoryClick(selectedCategory)}
                className="hover:text-white transition-colors">
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
            <span className="text-white/40 text-sm">
              {filteredCategories.length} result
              {filteredCategories.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Categories Display */}
        {loading ?
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        : filteredCategories.length === 0 ?
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-white mb-2">
              No categories found
            </h3>
            <p className="text-white/40">
              {hasActiveFilters || searchTerm ?
                "Try adjusting your search terms or clear the filters"
              : "No categories have been assigned to repositories yet"}
            </p>
            {(hasActiveFilters || searchTerm) && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        : viewMode === "grid" ?
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-primary/50 transition-all hover:transform hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-2">
                  <CategoryBadge
                    category={category.category}
                    confidence={category.confidence}
                    size="lg"
                    showConfidence={true}
                  />
                  <span className="text-white/20 text-xs">#{category.id}</span>
                </div>
                <div className="mt-3">
                  <h4 className="text-white font-medium truncate">
                    {category.repository_name}
                  </h4>
                  {category.repository_display_name && (
                    <p className="text-white/40 text-sm truncate">
                      {category.repository_display_name}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
                  <span className="text-white/40">
                    Confidence: {category.confidence}%
                  </span>
                  <span className="text-white/40">
                    Repo ID: {category.repository}
                  </span>
                </div>
              </div>
            ))}
          </div>
          // List View
        : <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Repository
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <CategoryBadge
                          category={category.category}
                          confidence={category.confidence}
                          size="md"
                          showConfidence={false}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">
                          {category.repository_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-white/10 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                category.confidence >= 70 ? "bg-green-400"
                                : category.confidence >= 50 ? "bg-yellow-400"
                                : "bg-orange-400"
                              }`}
                              style={{ width: `${category.confidence}%` }}
                            />
                          </div>
                          <span className="text-white/60 text-sm">
                            {category.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-white/60">
                          {category.repository_display_name || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-white/40 text-xs">
                          #{category.id}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </DashboardLayout>
  );
};
