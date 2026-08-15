import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRepositoryCategories } from "../hooks/useRepositoryCategories";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { CategoryManager } from "../components/project-categories/CategoryManager";

export const RepositoryCategoriesPage = () => {
  const { repositoryId } = useParams();
  const {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    recalculateConfidence,
  } = useRepositoryCategories(repositoryId);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Repository Categories
          </h1>
          <p className="text-white/60 text-sm">
            Manage categories for repository #{repositoryId}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <CategoryManager
            categories={categories}
            loading={loading}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
            onRecalculate={recalculateConfidence}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
