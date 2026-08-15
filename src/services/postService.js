import { api } from "./api";

const postService = {
  // Get all posts with optional filtering
  getPosts: async (params = {}) => {
    const response = await api.get("/posts/", { params });
    return response.data;
  },

  // Get a single post by ID
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  // Get posts by community
  getPostsByCommunity: async (communityId) => {
    const response = await api.get(`/posts/community/${communityId}/`);
    return response.data;
  },

  // Get posts by user
  getPostsByUser: async (userId) => {
    const response = await api.get(`/posts/user/${userId}/`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post("/posts/", postData);
    return response.data;
  },

  // Update a post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}/`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}/`);
    return response.data;
  },
};

export default postService;
