import React, { useState } from "react";
import { FaTimes, FaGithub, FaLink } from "react-icons/fa";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

export const CreatePostModal = ({ isOpen, onClose, communityId, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    github_repo_url: "",
    blog_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    if (!formData.content.trim() || formData.content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const postData = {
        ...formData,
        community_id: communityId,
        title: formData.title.trim(),
        content: formData.content.trim(),
      };
      const result = await onSubmit(postData);
      if (result) {
        setFormData({
          title: "",
          content: "",
          github_repo_url: "",
          blog_url: "",
        });
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-white/60 text-sm font-medium mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className={`w-full bg-white/5 border ${errors.title ? "border-red-400" : "border-white/10"} rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-white/60 text-sm font-medium mb-1">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows="6"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className={`w-full bg-white/5 border ${errors.content ? "border-red-400" : "border-white/10"} rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-vertical`}
              disabled={loading}
            />
            {errors.content && (
              <p className="text-red-400 text-xs mt-1">{errors.content}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label
              htmlFor="github_repo_url"
              className="block text-white/60 text-sm font-medium mb-1">
              <FaGithub className="inline mr-1" /> GitHub Repository URL
            </label>
            <input
              id="github_repo_url"
              name="github_repo_url"
              type="url"
              value={formData.github_repo_url}
              onChange={handleChange}
              placeholder="https://github.com/user/repo"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Blog URL */}
          <div>
            <label
              htmlFor="blog_url"
              className="block text-white/60 text-sm font-medium mb-1">
              <FaLink className="inline mr-1" /> Blog Post URL
            </label>
            <input
              id="blog_url"
              name="blog_url"
              type="url"
              value={formData.blog_url}
              onChange={handleChange}
              placeholder="https://blog.example.com/post"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary"
              disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
