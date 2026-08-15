import { useState, useEffect } from "react";
import { repositoryService } from "../services/repositoryService";

export const useRepositoryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repositoryService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const languages = await repositoryService.getLanguages();
      return languages;
    } catch (err) {
      console.error("Error fetching languages:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    fetchLanguages,
  };
};
