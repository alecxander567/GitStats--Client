import { api } from "./api";

export const contributorService = {
  // Get all contributors for the authenticated user
  async getContributors(params = {}) {
    try {
      const response = await api.get("/analytics/contributors/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching contributors:", error);
      throw error;
    }
  },

  // Get top contributors
  async getTopContributors(limit = 10) {
    try {
      const response = await api.get(
        `/analytics/contributors/top-contributors/?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching top contributors:", error);
      throw error;
    }
  },

  // Get languages for a specific contributor
  async getContributorLanguages(contributorId) {
    try {
      const response = await api.get(
        `/analytics/contributors/${contributorId}/languages/`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contributor languages:", error);
      throw error;
    }
  },

  // Bulk create contributors
  async bulkCreateContributors(repositoryId, contributors) {
    try {
      const response = await api.post("/analytics/contributors/bulk-create/", {
        repository_id: repositoryId,
        contributors,
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk creating contributors:", error);
      throw error;
    }
  },

  // Get contributors by repository
  async getContributorsByRepository(repositoryId) {
    try {
      const response = await api.get(
        `/analytics/contributors/?repository=${repositoryId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contributors by repository:", error);
      throw error;
    }
  },
};
