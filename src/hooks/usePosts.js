import { useState, useEffect, useCallback } from "react";
import postService from "../services/postService";
import { useAlert } from "../contexts/AlertContext";

export const usePosts = (communityId = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  const fetchPosts = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (communityId) {
          data = await postService.getPostsByCommunity(communityId);
        } else {
          data = await postService.getPosts(params);
        }
        setPosts(data);
        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to fetch posts";
        setError(errorMessage);
        showAlert(errorMessage, "error");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [communityId, showAlert],
  );

  const createPost = useCallback(
    async (postData) => {
      setLoading(true);
      setError(null);
      try {
        const newPost = await postService.createPost(postData);
        setPosts((prev) => [newPost, ...prev]);
        showAlert("Post created successfully!", "success");
        return newPost;
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to create post";
        setError(errorMessage);
        showAlert(errorMessage, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showAlert],
  );

  const updatePost = useCallback(
    async (id, postData) => {
      setLoading(true);
      setError(null);
      try {
        const updatedPost = await postService.updatePost(id, postData);
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post)),
        );
        showAlert("Post updated successfully!", "success");
        return updatedPost;
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to update post";
        setError(errorMessage);
        showAlert(errorMessage, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showAlert],
  );

  const deletePost = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await postService.deletePost(id);
        setPosts((prev) => prev.filter((post) => post.id !== id));
        showAlert("Post deleted successfully!", "success");
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to delete post";
        setError(errorMessage);
        showAlert(errorMessage, "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showAlert],
  );

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId, fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost, // Make sure this is exported
    deletePost,
  };
};
