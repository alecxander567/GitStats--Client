import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLink, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EditPostModal } from "./EditPostModal";

export const PostCard = ({ post, onEdit, onDelete, showCommunity = false }) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOwner = user && post.user === user.id;

  const handleDelete = async () => {
    const success = await onDelete(post.id);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = async (updatedData) => {
    if (onEdit) {
      const success = await onEdit(post.id, updatedData);
      if (success) {
        setShowEditModal(false);
      }
      return success;
    }
    return false;
  };

  const formatDate = (date) => {
    try {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      }
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      }
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      }
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      }
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
      }
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    } catch {
      return "Just now";
    }
  };

  const getAvatarUrl = (avatarUrl, displayName) => {
    if (avatarUrl && !imageError) {
      return avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${displayName || "User"}&background=6C63FF&color=fff&size=128`;
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/20 hover:border-white/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <img
              src={getAvatarUrl(
                post.user_avatar_url,
                post.user_display_name || post.username,
              )}
              alt={post.username}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover flex-shrink-0"
              onError={() => setImageError(true)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <Link
                  to={`/users/${post.user_id}`}
                  className="font-medium text-white hover:text-primary transition-colors truncate">
                  {post.user_display_name || post.username}
                </Link>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-white/40 text-xs flex items-center gap-1">
                  <FaCalendar className="w-3 h-3" />
                  {formatDate(post.created_at)}
                </span>
              </div>
              {showCommunity && (
                <Link
                  to={`/communities/${post.community_slug}`}
                  className="text-xs text-primary hover:text-primary-light transition-colors">
                  {post.community_name}
                </Link>
              )}
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="p-2">
                <FaEdit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400/50">
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">{post.title}</h3>
          <p className="text-white/80 text-sm whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Links */}
          {(post.github_repo_url || post.blog_url) && (
            <div className="flex flex-wrap gap-3 mt-2">
              {post.github_repo_url && (
                <a
                  href={post.github_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-3 py-1.5 rounded-lg">
                  <FaGithub className="w-4 h-4" />
                  View Repository
                </a>
              )}
              {post.blog_url && (
                <a
                  href={post.blog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors bg-white/5 px-3 py-1.5 rounded-lg">
                  <FaLink className="w-4 h-4" />
                  Read Blog
                </a>
              )}
            </div>
          )}

          {/* Footer - Reply button removed */}
          <div className="flex items-center justify-end text-white/40 text-xs pt-2 border-t border-white/10">
            <span>Updated {formatDate(post.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
        post={post}
      />
    </>
  );
};
