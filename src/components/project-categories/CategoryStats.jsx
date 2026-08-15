import React from "react";
import { CategoryBadge } from "./CategoryBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const CategoryStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        <p>No category statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stats.map((stat) => (
        <div
          key={stat.category}
          className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            <CategoryBadge category={stat.category} size="md" />
          </div>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>Count: {stat.count}</span>
            <span>Avg: {stat.avg_confidence.toFixed(1)}%</span>
            <span className="hidden sm:inline">
              Range: {stat.min_confidence.toFixed(1)}% -{" "}
              {stat.max_confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
