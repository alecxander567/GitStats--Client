// hooks/useLanguages.js
import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export const useLanguages = (repositoryId) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLanguages = useCallback(async () => {
    if (!repositoryId) {
      setLanguages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/languages/`, {
        params: { repository_id: repositoryId },
      });

      let languagesData = [];
      const data = response.data;

      if (Array.isArray(data)) {
        // Plain array response (e.g. pagination disabled on the backend)
        languagesData = data.map((lang) => ({
          language: lang.language || lang.name || "Unknown",
          percentage: lang.percentage || lang.percent || 0,
          bytes: lang.bytes || lang.size || 0,
        }));
      } else if (data && Array.isArray(data.results)) {
        // DRF paginated response: { count, next, previous, results: [...] }
        languagesData = data.results.map((lang) => ({
          language: lang.language || lang.name || "Unknown",
          percentage: lang.percentage || lang.percent || 0,
          bytes: lang.bytes || lang.size || 0,
        }));
      } else if (data && Array.isArray(data.languages)) {
        // Custom wrapper: { languages: [...] }
        languagesData = data.languages.map((lang) => ({
          language: lang.language || lang.name || "Unknown",
          percentage: lang.percentage || lang.percent || 0,
          bytes: lang.bytes || lang.size || 0,
        }));
      }

      setLanguages(languagesData);
    } catch (err) {
      console.error(`Error fetching languages for repo ${repositoryId}:`, err);
      setError(err.message || "Failed to fetch languages");
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    languages,
    loading,
    error,
    fetchLanguages,
  };
};
