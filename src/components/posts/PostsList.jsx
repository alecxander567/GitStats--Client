import React from "react";
import { PostCard } from "./PostCard";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { FaComments, FaPlus, FaFileAlt } from "react-icons/fa";
import { Button } from "../common/Button";

export const PostsList = ({
  posts,
  loading,
  onEdit,
  onDelete,
  onCreatePost,
  showCommunity = false,
  canCreate = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/20 text-center">
        <div className="text-6xl mb-4 text-white/20 flex justify-center">
          <FaFileAlt className="w-16 h-16" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
        <p className="text-white/60 mb-4">
          Be the first to share something with the community!
        </p>
        {canCreate && (
          <Button
            onClick={onCreatePost}
            className="inline-flex items-center gap-2">
            <FaPlus className="w-4 h-4" />
            Create Post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-white/60">
          <FaComments className="w-4 h-4" />
          <span className="text-sm">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            showCommunity={showCommunity}
          />
        ))}
      </div>
    </div>
  );
};
