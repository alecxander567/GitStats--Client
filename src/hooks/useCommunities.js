import { useState, useEffect, useCallback } from "react";
import { communityService } from "../services/communityService";

export const useCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommunities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getCommunities(params);
      setCommunities(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch communities");
      console.error("Error fetching communities:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommunity = useCallback(async (communityData) => {
    setLoading(true);
    setError(null);
    try {
      const newCommunity =
        await communityService.createCommunity(communityData);
      setCommunities((prev) => [newCommunity, ...prev]);
      return newCommunity;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create community");
      console.error("Error creating community:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCommunity = useCallback(async (id, communityData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCommunity = await communityService.updateCommunity(
        id,
        communityData,
      );
      setCommunities((prev) =>
        prev.map((community) =>
          community.id === id ? updatedCommunity : community,
        ),
      );
      return updatedCommunity;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update community");
      console.error("Error updating community:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCommunity = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await communityService.deleteCommunity(id);
      setCommunities((prev) => prev.filter((community) => community.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete community");
      console.error("Error deleting community:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return {
    communities,
    loading,
    error,
    fetchCommunities,
    createCommunity,
    updateCommunity,
    deleteCommunity,
  };
};

// Hook for community members
export const useCommunityMembers = (communityId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getCommunityMembers(communityId);
      setMembers(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch members");
      console.error("Error fetching members:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  const addMember = useCallback(
    async (userId, role = "member") => {
      setLoading(true);
      setError(null);
      try {
        const newMember = await communityService.addMember({
          community_id: communityId,
          user_id: userId,
          role,
        });
        setMembers((prev) => [...prev, newMember]);
        return newMember;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add member");
        console.error("Error adding member:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [communityId],
  );

  const updateMemberRole = useCallback(async (memberId, role) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await communityService.updateMemberRole(memberId, role);
      setMembers((prev) => prev.map((m) => (m.id === memberId ? updated : m)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update member role");
      console.error("Error updating member role:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (memberId) => {
    setLoading(true);
    setError(null);
    try {
      await communityService.removeMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
      console.error("Error removing member:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (communityId) {
      fetchMembers();
    }
  }, [communityId, fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
  };
};

// Hook for current user's communities
export const useMyCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getMyCommunities();
      setCommunities(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch your communities",
      );
      console.error("Error fetching your communities:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCommunities();
  }, [fetchMyCommunities]);

  return {
    communities,
    loading,
    error,
    fetchMyCommunities,
  };
};
