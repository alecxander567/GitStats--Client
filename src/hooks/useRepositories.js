// hooks/useRepositories.js - FULL FILE
import { useState, useEffect, useCallback, useRef } from "react";
import { repositoryService } from "../services/repositoryService";

// Global cache outside the hook
let cachedRepositories = null;
let cachedPagination = null;
let isLoading = false;
let fetchPromise = null;

export const useRepositories = (initialFilters = {}) => {
  const [repositories, setRepositories] = useState(cachedRepositories || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(
    cachedPagination || {
      count: 0,
      next: null,
      previous: null,
    },
  );

  const fetchRepositories = useCallback(async (params = {}) => {
    // If we already have cached data, use it
    if (cachedRepositories) {
      setRepositories(cachedRepositories);
      setPagination(cachedPagination);
      return;
    }

    // If already fetching, wait for the existing promise
    if (fetchPromise) {
      await fetchPromise;
      setRepositories(cachedRepositories || []);
      setPagination(
        cachedPagination || { count: 0, next: null, previous: null },
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      fetchPromise = repositoryService.getRepositories(params);
      const data = await fetchPromise;
      const repos = data.results || data;

      cachedRepositories = Array.isArray(repos) ? repos : [];
      cachedPagination =
        data.count !== undefined ?
          {
            count: data.count,
            next: data.next,
            previous: data.previous,
          }
        : { count: 0, next: null, previous: null };

      setRepositories(cachedRepositories);
      setPagination(cachedPagination);

      fetchPromise = null;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch repositories");
      console.error("Error fetching repositories:", err);
      setRepositories([]);
      fetchPromise = null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      const cleanedFilters = {};
      Object.keys(newFilters).forEach((key) => {
        if (
          newFilters[key] !== "" &&
          newFilters[key] !== undefined &&
          newFilters[key] !== null
        ) {
          cleanedFilters[key] = newFilters[key];
        }
      });

      setFilters(cleanedFilters);

      const params = {};
      if (cleanedFilters.search) params.search = cleanedFilters.search;
      if (cleanedFilters.visibility)
        params.visibility = cleanedFilters.visibility;
      if (
        cleanedFilters.archived !== undefined &&
        cleanedFilters.archived !== ""
      ) {
        params.archived = cleanedFilters.archived;
      }
      if (cleanedFilters.ordering) params.ordering = cleanedFilters.ordering;

      // Clear cache when filters change
      cachedRepositories = null;
      cachedPagination = null;
      fetchPromise = null;
      fetchRepositories(params);
    },
    [fetchRepositories],
  );

  useEffect(() => {
    fetchRepositories({});
  }, []);

  // Force refresh function
  const refresh = useCallback(async () => {
    cachedRepositories = null;
    cachedPagination = null;
    fetchPromise = null;
    await fetchRepositories({});
  }, [fetchRepositories]);

  const createRepository = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newRepo = await repositoryService.createRepository(data);
      // Clear cache so next fetch gets fresh data
      cachedRepositories = null;
      cachedPagination = null;
      fetchPromise = null;
      setRepositories((prev) => [newRepo, ...prev]);
      return newRepo;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create repository");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRepository = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRepo = await repositoryService.updateRepository(id, data);
      cachedRepositories = null;
      cachedPagination = null;
      setRepositories((prev) =>
        prev.map((repo) => (repo.id === id ? updatedRepo : repo)),
      );
      return updatedRepo;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update repository");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRepository = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await repositoryService.deleteRepository(id);
      cachedRepositories = null;
      cachedPagination = null;
      setRepositories((prev) => prev.filter((repo) => repo.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete repository");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncRepositories = async (repositoriesData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await repositoryService.bulkSync(repositoriesData);
      // Clear cache after sync
      cachedRepositories = null;
      cachedPagination = null;
      fetchPromise = null;
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.visibility) params.visibility = filters.visibility;
      if (filters.archived !== undefined && filters.archived !== "") {
        params.archived = filters.archived;
      }
      if (filters.ordering) params.ordering = filters.ordering;
      await fetchRepositories(params);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to sync repositories");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    repositories,
    loading,
    error,
    filters,
    pagination,
    fetchRepositories,
    createRepository,
    updateRepository,
    deleteRepository,
    syncRepositories,
    setFilters: updateFilters,
    refresh,
  };
};
