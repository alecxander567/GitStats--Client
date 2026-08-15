import { useState, useEffect, useCallback } from "react";
import { projectCategoryService } from "../services/projectCategoryService";

export const useRepositoryCategories = (repositoryId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!repositoryId) {
      setCategories([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data =
        await projectCategoryService.getCategoriesByRepository(repositoryId);
      setCategories(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch repository categories",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [repositoryId]);

  const addCategory = useCallback(
    async (categoryData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectCategoryService.createCategory({
          repository_id: repositoryId,
          ...categoryData,
        });
        setCategories((prev) => [...prev, data]);
        return data;
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to add category",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [repositoryId],
  );

  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectCategoryService.updateCategory(
        id,
        categoryData,
      );
      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)));
      return data;
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to update category",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await projectCategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to delete category",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculateConfidence = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectCategoryService.recalculateConfidence(id);
        await fetchCategories();
        return data;
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to recalculate confidence",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    fetchCategories();
  }, [repositoryId, fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    recalculateConfidence,
  };
};
