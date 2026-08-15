import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useCommunity } from "../hooks/useCommunity";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "../contexts/AuthContext";
import { useCommunityMembers } from "../hooks/useCommunities";
import { useAlert } from "../contexts/AlertContext";
import { PostsList } from "../components/posts/PostsList";
import { CreatePostModal } from "../components/posts/CreatePostModal";
import { FaArrowLeft, FaPlus, FaComments } from "react-icons/fa";

export const CommunityPostsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {
    community,
    loading: communityLoading,
    fetchCommunityBySlug,
  } = useCommunity();
  const {
    posts,
    loading: postsLoading,
    createPost,
    updatePost,
    deletePost,
    fetchPosts,
  } = usePosts();
  const { members, fetchMembers } = useCommunityMembers(community?.id);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCommunityBySlug(slug);
    }
  }, [slug, fetchCommunityBySlug]);

  useEffect(() => {
    if (community?.id) {
      fetchPosts({ community_id: community.id });
      fetchMembers();
    }
  }, [community?.id, fetchPosts, fetchMembers]);

  const isMember = members.some((m) => m.user_id === user?.id);

  const handleCreatePost = async (postData) => {
    const result = await createPost({
      ...postData,
      community_id: community.id,
    });
    if (result) {
      showAlert("Post created successfully!");
      setShowCreatePostModal(false);
      await fetchPosts({ community_id: community.id });
    }
    return result;
  };

  const handleEditPost = async (postId, updatedData) => {
    const result = await updatePost(postId, updatedData);
    if (result) {
      showAlert("Post updated successfully!");
      await fetchPosts({ community_id: community.id });
    }
    return result;
  };

  const handleDeletePost = async (postId) => {
    const success = await deletePost(postId);
    if (success) {
      showAlert("Post deleted successfully!");
      await fetchPosts({ community_id: community.id });
    }
    return success;
  };

  if (communityLoading || !community) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/communities/${slug}`)}
              className="text-white/60 hover:text-white transition-colors p-1 flex-shrink-0"
              aria-label="Go back">
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 truncate">
                <FaComments className="text-primary flex-shrink-0" />
                <span className="truncate">{community.name} Posts</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm truncate">
                View and discuss topics in this community
              </p>
            </div>
          </div>
          {isMember && (
            <Button
              onClick={() => setShowCreatePostModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary w-full sm:w-auto justify-center">
              <FaPlus className="w-4 h-4" />
              New Post
            </Button>
          )}
        </div>

        {/* Posts List */}
        <PostsList
          posts={posts}
          loading={postsLoading}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          canCreate={false}
          onCreatePost={() => setShowCreatePostModal(true)}
        />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          communityId={community.id}
          onSubmit={handleCreatePost}
        />
      </div>
    </DashboardLayout>
  );
};
