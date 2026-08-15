import { api } from "./api";

export const communityService = {
  // Get all communities
  getCommunities: async (params = {}) => {
    const response = await api.get("/communities/", { params });
    return response.data;
  },

  // Get a single community by ID
  getCommunity: async (id) => {
    const response = await api.get(`/communities/${id}/`);
    return response.data;
  },

  // Get a community by slug
  getCommunityBySlug: async (slug) => {
    const response = await api.get(`/communities/slug/${slug}/`);
    return response.data;
  },

  // Create a new community
  createCommunity: async (communityData) => {
    const response = await api.post("/communities/", communityData);
    return response.data;
  },

  // Update a community
  updateCommunity: async (id, communityData) => {
    const response = await api.put(`/communities/${id}/`, communityData);
    return response.data;
  },

  // Partial update a community
  patchCommunity: async (id, communityData) => {
    const response = await api.patch(`/communities/${id}/`, communityData);
    return response.data;
  },

  // Delete a community
  deleteCommunity: async (id) => {
    const response = await api.delete(`/communities/${id}/`);
    return response.data;
  },

  // ======================
  // COMMUNITY MEMBER SERVICES
  // ======================

  // Get all members with filters
  getMembers: async (params = {}) => {
    const response = await api.get("/communities/members/", { params });
    return response.data;
  },

  // Get members of a specific community
  getCommunityMembers: async (communityId) => {
    const response = await api.get("/communities/members/community_members/", {
      params: { community_id: communityId },
    });
    return response.data;
  },

  // Get communities a user belongs to
  getUserCommunities: async (userId) => {
    const response = await api.get("/communities/members/user_communities/", {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Get current user's communities
  getMyCommunities: async () => {
    const response = await api.get("/communities/members/my_communities/");
    return response.data;
  },

  // Add a member to a community
  addMember: async (data) => {
    const response = await api.post("/communities/members/", data);
    return response.data;
  },

  // Update a member's role
  updateMemberRole: async (memberId, role) => {
    const response = await api.put(`/communities/members/${memberId}/`, {
      role,
    });
    return response.data;
  },

  // Remove a member from a community
  removeMember: async (memberId) => {
    const response = await api.delete(`/communities/members/${memberId}/`);
    return response.data;
  },
};
