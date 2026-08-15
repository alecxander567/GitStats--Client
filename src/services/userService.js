import { api } from "./api";

export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/users/auth/me/");
    return response.data;
  },

  // Search users - updated to use /list/ endpoint
  searchUsers: async (query) => {
    try {
      const response = await api.get(
        `/users/list/?q=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Update user profile
  updateUser: async (id, data) => {
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/users/auth/logout/");
    return response.data;
  },

  // Add GitHub token
  addGitHubToken: async (githubToken) => {
    const response = await api.post("/users/auth/github/add-token/", {
      github_token: githubToken,
    });
    return response.data;
  },

  // Remove GitHub token
  removeGitHubToken: async () => {
    const response = await api.post("/users/auth/github/remove-token/");
    return response.data;
  },
};
