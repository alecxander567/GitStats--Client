// services/languageService.js
import { api } from "./api"; // Note the curly braces for named import

export const languageService = {
  getRepositoryLanguages: async (repositoryId) => {
    try {
      const response = await api.get(
        `/languages/get_languages_by_repository/${repositoryId}/`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching repository languages:", error);
      throw error;
    }
  },

  getLanguages: async (params = {}) => {
    try {
      const response = await api.get("/languages/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  },

  bulkUpdateLanguages: async (repositoryId, languages) => {
    try {
      const response = await api.post("/languages/bulk-update/", {
        repository_id: repositoryId,
        languages,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating languages:", error);
      throw error;
    }
  },

  getLanguageSummary: async () => {
    try {
      const response = await api.get("/languages/summary/");
      return response.data;
    } catch (error) {
      console.error("Error fetching language summary:", error);
      throw error;
    }
  },

  searchLanguages: async (searchTerm) => {
    try {
      const response = await api.get(
        `/languages/search/?q=${encodeURIComponent(searchTerm)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching languages:", error);
      throw error;
    }
  },

  getTopLanguages: async (limit = 10) => {
    try {
      const response = await api.get(`/languages/top/?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching top languages:", error);
      throw error;
    }
  },
};

export default languageService;
