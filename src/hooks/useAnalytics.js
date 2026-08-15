import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";
import { ANALYTICS_SYNCED_EVENT } from "./useGithubSync";

export const useAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [repositoryStats, setRepositoryStats] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [updateLogs, setUpdateLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getStatsSummary();
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepositoryStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getLatestRepositoryStats();
      setRepositoryStats(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getLatestUserStats();
      setUserStats(data);
      return data;
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.detail || err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpdateLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getRecentLogs();
      setUpdateLogs(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRepositoryTrend = useCallback(async (repoId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getRepositoryTrend(repoId);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackUpdateStart = useCallback(
    async (updateType = "MANUAL", repositoryId = null) => {
      try {
        const data = await analyticsService.createUpdateLog({
          update_type: updateType,
          repository: repositoryId,
          status: "IN_PROGRESS",
        });
        return data;
      } catch (err) {
        console.error("Failed to create update log:", err);
        throw err;
      }
    },
    [],
  );

  const trackUpdateComplete = useCallback(async (logId) => {
    try {
      const data = await analyticsService.completeUpdateLog(logId);
      return data;
    } catch (err) {
      console.error("Failed to complete update log:", err);
      throw err;
    }
  }, []);

  const trackUpdateFail = useCallback(async (logId, errorMessage) => {
    try {
      const data = await analyticsService.failUpdateLog(logId, errorMessage);
      return data;
    } catch (err) {
      console.error("Failed to mark update log as failed:", err);
      throw err;
    }
  }, []);

  // Auto-refresh data when analytics sync completes
  useEffect(() => {
    const handleAnalyticsSync = () => {
      console.log("Analytics sync detected, refreshing data...");
      fetchSummary();
      fetchRepositoryStats();
      fetchUserStats();
      fetchUpdateLogs();
    };

    window.addEventListener(ANALYTICS_SYNCED_EVENT, handleAnalyticsSync);
    return () => {
      window.removeEventListener(ANALYTICS_SYNCED_EVENT, handleAnalyticsSync);
    };
  }, [fetchSummary, fetchRepositoryStats, fetchUserStats, fetchUpdateLogs]);

  return {
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
    getRepositoryTrend,
    trackUpdateStart,
    trackUpdateComplete,
    trackUpdateFail,
  };
};
