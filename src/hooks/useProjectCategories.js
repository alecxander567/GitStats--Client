import { useState, useEffect, useCallback, useRef } from "react";
import { projectCategoryService } from "../services/projectCategoryService";

export const useProjectCategories = (initialFilters = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const isInitialMount = useRef(true);

  const fetchCategories = useCallback(
    async (newFilters = null) => {
      // Ensure we're not passing React event objects
      const activeFilters = newFilters || filters;

      // Clean the filters to remove any React synthetic event properties
      const cleanFilters = {};
      if (
        activeFilters &&
        typeof activeFilters === "object" &&
        !activeFilters._reactName
      ) {
        Object.keys(activeFilters).forEach((key) => {
          if (
            activeFilters[key] !== undefined &&
            activeFilters[key] !== null &&
            activeFilters[key] !== "" &&
            typeof activeFilters[key] !== "function" &&
            !key.startsWith("_reactName")
          ) {
            cleanFilters[key] = activeFilters[key];
          }
        });
      }

      setLoading(true);
      setError(null);
      try {
        const data = await projectCategoryService.getCategories(cleanFilters);
        setCategories(data);
        return data;
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch categories",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectCategoryService.createCategory(categoryData);
      setCategories((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to create category",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkCreateCategories = useCallback(
    async (categoriesData) => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await projectCategoryService.bulkCreateCategories(categoriesData);
        await fetchCategories(); // Refresh the list
        return result;
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to bulk create categories",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
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

  const getCategoriesByRepository = useCallback(async (repositoryId) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await projectCategoryService.getCategoriesByRepository(repositoryId);
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
  }, []);

  const getStats = useCallback(async (params = {}) => {
    // Clean params to remove React event objects
    const cleanParams = {};
    if (params && typeof params === "object" && !params._reactName) {
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== "" &&
          typeof params[key] !== "function" &&
          !key.startsWith("_reactName")
        ) {
          cleanParams[key] = params[key];
        }
      });
    }

    setLoading(true);
    setError(null);
    try {
      const data = await projectCategoryService.getStats(cleanParams);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to fetch stats",
      );
      return null;
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
        await fetchCategories(); // Refresh the list
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

  // Only fetch on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      fetchCategories();
      isInitialMount.current = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    categories,
    loading,
    error,
    filters,
    setFilters,
    fetchCategories,
    createCategory,
    bulkCreateCategories,
    updateCategory,
    deleteCategory,
    getCategoriesByRepository,
    getStats,
    recalculateConfidence,
  };
};
