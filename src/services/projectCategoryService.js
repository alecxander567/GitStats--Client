import { api } from "./api";

export const projectCategoryService = {
  // Get all project categories with optional filters
  getCategories: async (params = {}) => {
    // Clean params to remove undefined values and React event objects
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      // Skip React synthetic event properties
      if (
        key.startsWith("_reactName") ||
        key === "nativeEvent" ||
        key === "target" ||
        key === "eventPhase" ||
        key === "bubbles" ||
        key === "cancelable" ||
        key === "timeStamp" ||
        key === "defaultPrevented" ||
        key === "isTrusted" ||
        key === "view" ||
        key === "detail" ||
        key === "screenX" ||
        key === "screenY" ||
        key === "clientX" ||
        key === "clientY" ||
        key === "pageX" ||
        key === "pageY" ||
        key === "ctrlKey" ||
        key === "shiftKey" ||
        key === "altKey" ||
        key === "metaKey" ||
        key === "getModifierState" ||
        key === "button" ||
        key === "buttons" ||
        key === "movementX" ||
        key === "movementY" ||
        key === "isDefaultPrevented" ||
        key === "isPropagationStopped" ||
        typeof params[key] === "function" ||
        params[key] === undefined ||
        params[key] === null ||
        params[key] === ""
      ) {
        return;
      }
      cleanParams[key] = params[key];
    });

    const response = await api.get("/project-categories/", {
      params: cleanParams,
    });
    return response.data;
  },

  // Get a single category by ID
  getCategory: async (id) => {
    const response = await api.get(`/project-categories/${id}/`);
    return response.data;
  },

  // Create a single category
  createCategory: async (data) => {
    const response = await api.post("/project-categories/", data);
    return response.data;
  },

  // Bulk create/update categories
  bulkCreateCategories: async (categories) => {
    const response = await api.post("/project-categories/bulk_create/", {
      categories,
    });
    return response.data;
  },

  // Update a category
  updateCategory: async (id, data) => {
    const response = await api.put(`/project-categories/${id}/`, data);
    return response.data;
  },

  // Partial update a category
  patchCategory: async (id, data) => {
    const response = await api.patch(`/project-categories/${id}/`, data);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`/project-categories/${id}/`);
    return response.data;
  },

  // Get categories for a specific repository
  getCategoriesByRepository: async (repositoryId) => {
    const response = await api.get(
      `/project-categories/by_repository/?repository_id=${repositoryId}`,
    );
    return response.data;
  },

  // Get statistics
  getStats: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        cleanParams[key] = params[key];
      }
    });
    const response = await api.get("/project-categories/stats/", {
      params: cleanParams,
    });
    return response.data;
  },

  // Recalculate confidence for a category
  recalculateConfidence: async (id) => {
    const response = await api.post(
      `/project-categories/${id}/recalculate_confidence/`,
    );
    return response.data;
  },
};
