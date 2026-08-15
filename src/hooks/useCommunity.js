import { useState, useEffect, useCallback } from "react";
import { communityService } from "../services/communityService";

export const useCommunity = (id) => {
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommunity = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getCommunity(id);
      setCommunity(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch community");
      console.error("Error fetching community:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCommunityBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getCommunityBySlug(slug);
      setCommunity(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch community");
      console.error("Error fetching community by slug:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  return {
    community,
    loading,
    error,
    fetchCommunity,
    fetchCommunityBySlug,
  };
};
