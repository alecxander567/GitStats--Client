// hooks/useContributorActivity.js
import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export const useContributorActivity = () => {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [topContributors, setTopContributors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all activities with optional filters
  const fetchActivities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getContributorActivities(params);
      setActivities(data.results || data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch activities",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch activity summary
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getContributorActivitySummary();
      setSummary(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to fetch summary",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch top contributors
  const fetchTopContributors = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getTopContributors(limit);
      setTopContributors(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch top contributors",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch contributor analytics
  const fetchAnalytics = useCallback(async (days = 30) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getContributorAnalytics(days);
      setAnalytics(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch analytics",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new activity
  const createActivity = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.createContributorActivity(data);
      setActivities((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to create activity",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk create activities
  const bulkCreateActivities = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result =
        await analyticsService.bulkCreateContributorActivities(data);
      if (result.data) {
        setActivities((prev) => [...result.data, ...prev]);
      }
      return result;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to bulk create activities",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get trends for a specific contributor
  const getContributorTrends = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getContributorTrends(id);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to fetch trends",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchActivities(),
        fetchSummary(),
        fetchTopContributors(),
        fetchAnalytics(),
      ]);
    } catch (err) {
      // Error already set in individual calls
      console.error("Error loading all data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchActivities, fetchSummary, fetchTopContributors, fetchAnalytics]);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    activities,
    summary,
    topContributors,
    analytics,
    loading,
    error,
    fetchActivities,
    fetchSummary,
    fetchTopContributors,
    fetchAnalytics,
    createActivity,
    bulkCreateActivities,
    getContributorTrends,
    loadAllData,
    refresh: loadAllData,
  };
};
