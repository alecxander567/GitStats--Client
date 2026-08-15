import { api } from "./api";

export const analyticsService = {
  // Repository Stats
  async getRepositoryStats() {
    const response = await api.get("/analytics/repository-stats/");
    return response.data;
  },

  async getLatestRepositoryStats() {
    const response = await api.get("/analytics/repository-stats/latest/");
    return response.data;
  },

  async getRepositoryTrend(repoId) {
    const response = await api.get(
      `/analytics/repository-stats/${repoId}/trend/`,
    );
    return response.data;
  },

  async getStatsSummary() {
    const response = await api.get("/analytics/repository-stats/summary/");
    return response.data;
  },

  async bulkCreateStats(data) {
    const response = await api.post(
      "/analytics/repository-stats/bulk-create/",
      data,
    );
    return response.data;
  },

  // User Stats
  async getUserStats() {
    const response = await api.get("/analytics/user-stats/");
    return response.data;
  },

  async getLatestUserStats() {
    const response = await api.get("/analytics/user-stats/latest/");
    return response.data;
  },

  async updateUserStats(data) {
    const response = await api.post("/analytics/user-stats/update/", data);
    return response.data;
  },

  // Update Logs
  async getUpdateLogs() {
    const response = await api.get("/analytics/update-logs/");
    return response.data;
  },

  async getRecentLogs() {
    const response = await api.get("/analytics/update-logs/recent/");
    return response.data;
  },

  async createUpdateLog(data) {
    const response = await api.post("/analytics/update-logs/", data);
    return response.data;
  },

  async completeUpdateLog(logId) {
    const response = await api.post(
      `/analytics/update-logs/${logId}/complete/`,
    );
    return response.data;
  },

  async failUpdateLog(logId, errorMessage) {
    const response = await api.post(`/analytics/update-logs/${logId}/fail/`, {
      error_message: errorMessage,
    });
    return response.data;
  },

  // ======================
  // CONTRIBUTOR ACTIVITY METHODS
  // ======================
  async getContributorActivities(params = {}) {
    const response = await api.get("/analytics/contributor-activities/", {
      params,
    });
    return response.data;
  },

  async getContributorActivity(id) {
    const response = await api.get(`/analytics/contributor-activities/${id}/`);
    return response.data;
  },

  async createContributorActivity(data) {
    const response = await api.post("/analytics/contributor-activities/", data);
    return response.data;
  },

  async updateContributorActivity(id, data) {
    const response = await api.put(
      `/analytics/contributor-activities/${id}/`,
      data,
    );
    return response.data;
  },

  async deleteContributorActivity(id) {
    const response = await api.delete(
      `/analytics/contributor-activities/${id}/`,
    );
    return response.data;
  },

  async getContributorActivitySummary() {
    const response = await api.get(
      "/analytics/contributor-activities/summary/",
    );
    return response.data;
  },

  async getTopContributors(limit = 10) {
    const response = await api.get(
      `/analytics/contributor-activities/top_contributors/?limit=${limit}`,
    );
    return response.data;
  },

  async getContributorTrends(id) {
    const response = await api.get(
      `/analytics/contributor-activities/${id}/trends/`,
    );
    return response.data;
  },

  async bulkCreateContributorActivities(data) {
    const response = await api.post(
      "/analytics/contributor-activities/bulk_create/",
      data,
    );
    return response.data;
  },

  async getContributorAnalytics(days = 30) {
    const response = await api.get(
      `/analytics/contributor-activities/analytics/?days=${days}`,
    );
    return response.data;
  },
};
