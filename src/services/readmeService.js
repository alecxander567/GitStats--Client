import { api } from "./api";

const readmeService = {
  // Get user's README profile
  getProfile: async () => {
    const response = await api.get("/readme-profile/profile/");
    return response.data;
  },

  // Update README profile
  updateProfile: async (data) => {
    const response = await api.put("/readme-profile/profile/", data);
    return response.data;
  },

  // Regenerate README
  regenerate: async () => {
    const response = await api.post("/readme-profile/profile/regenerate/");
    return response.data;
  },

  // Export README as .md file
  exportReadme: async () => {
    const response = await api.get("/readme-profile/profile/export/", {
      responseType: "blob",
    });
    return response;
  },

  // Preview README
  preview: async () => {
    const response = await api.get("/readme-profile/profile/preview/");
    return response.data;
  },

  // Toggle auto-update
  toggleAutoUpdate: async () => {
    const response = await api.post(
      "/readme-profile/profile/toggle_auto_update/",
    );
    return response.data;
  },

  // Get generation history
  getHistory: async () => {
    const response = await api.get("/readme-profile/profile/history/");
    return response.data;
  },

  // Get available templates
  getTemplates: async () => {
    const response = await api.get("/readme-profile/profile/templates/");
    return response.data;
  },
};

export default readmeService;
