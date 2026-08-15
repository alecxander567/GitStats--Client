import { api } from "./api";

export const repositoryService = {
  // Get all repositories with filters
  getRepositories: async (params = {}) => {
    const response = await api.get("/repositories/", { params });
    return response.data;
  },

  // Get single repository
  getRepository: async (id) => {
    const response = await api.get(`/repositories/${id}/`);
    return response.data;
  },

  // Create repository
  createRepository: async (data) => {
    const response = await api.post("/repositories/", data);
    return response.data;
  },

  // Update repository
  updateRepository: async (id, data) => {
    const response = await api.put(`/repositories/${id}/`, data);
    return response.data;
  },

  // Partial update
  patchRepository: async (id, data) => {
    const response = await api.patch(`/repositories/${id}/`, data);
    return response.data;
  },

  // Delete repository
  deleteRepository: async (id) => {
    const response = await api.delete(`/repositories/${id}/`);
    return response.data;
  },

  // Get repository statistics
  getStats: async () => {
    const response = await api.get("/repositories/stats/");
    return response.data;
  },

  // Bulk sync repositories
  bulkSync: async (repositories) => {
    const response = await api.post("/repositories/bulk/", { repositories });
    return response.data;
  },

  // Get unique languages
  getLanguages: async () => {
    const response = await api.get("/repositories/languages/");
    return response.data;
  },

  // ADD THIS - Get user commits for a repository
  getUserCommits: async (repoId) => {
    const response = await api.get(`/repositories/${repoId}/user-commits/`);
    return response.data;
  },
};
