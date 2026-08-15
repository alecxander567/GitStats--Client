import { useState, useEffect, useCallback } from "react";
import { contributorService } from "../services/contributorService";

export const useContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [contributorLanguages, setContributorLanguages] = useState([]);

  const fetchContributors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contributorService.getContributors(params);
      setContributors(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopContributors = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contributorService.getTopContributors(limit);
      setTopContributors(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContributorLanguages = useCallback(async (contributorId) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await contributorService.getContributorLanguages(contributorId);
      setContributorLanguages(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectContributor = useCallback(
    async (contributor) => {
      setSelectedContributor(contributor);
      // Clear immediately so the previously selected contributor's
      // language breakdown doesn't linger on screen while the new
      // contributor's languages are still being fetched.
      setContributorLanguages([]);

      if (contributor) {
        await fetchContributorLanguages(contributor.id);
      }
    },
    [fetchContributorLanguages],
  );

  const fetchContributorsByRepository = useCallback(async (repositoryId) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await contributorService.getContributorsByRepository(repositoryId);
      setContributors(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contributors,
    topContributors,
    loading,
    error,
    selectedContributor,
    contributorLanguages,
    fetchContributors,
    fetchTopContributors,
    fetchContributorLanguages,
    selectContributor,
    fetchContributorsByRepository,
  };
};
