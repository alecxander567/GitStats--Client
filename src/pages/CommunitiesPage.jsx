import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { CommunityGrid } from "../components/communities/CommunityGrid";
import { CreateCommunityModal } from "../components/communities/CreateCommunityModal";
import { PostsList } from "../components/posts/PostsList";
import { Button } from "../components/common/Button";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { useCommunities, useMyCommunities } from "../hooks/useCommunities";
import { usePosts } from "../hooks/usePosts";
import { useAlert } from "../contexts/AlertContext";
import {
  FaPlus,
  FaUsers,
  FaSearch,
  FaComments,
  FaArrowRight,
  FaInbox,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const CommunitiesPage = () => {
  const { showAlert } = useAlert();
  const {
    communities,
    loading,
    createCommunity,
    updateCommunity,
    deleteCommunity,
  } = useCommunities();

  const { communities: myCommunities } = useMyCommunities();
  const { posts, loading: postsLoading, fetchPosts } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, my
  const [viewMode, setViewMode] = useState("grid"); // grid, posts
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (data) => {
    try {
      await createCommunity(data);
      showAlert("Community created successfully!");
    } catch (error) {
      showAlert(error.message || "Failed to create community");
    }
  };

  const handleEdit = (community) => {
    setEditingCommunity(community);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data) => {
    if (editingCommunity) {
      try {
        await updateCommunity(editingCommunity.id, data);
        setEditingCommunity(null);
        showAlert("Community updated successfully!");
      } catch (error) {
        showAlert(error.message || "Failed to update community");
      }
    }
  };

  const handleDeleteClick = (community) => {
    setCommunityToDelete(community);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!communityToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCommunity(communityToDelete.id);
      showAlert(`Community "${communityToDelete.name}" deleted successfully!`);
      setDeleteConfirmOpen(false);
      setCommunityToDelete(null);
    } catch (error) {
      showAlert(error.message || "Failed to delete community");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCommunity(null);
  };

  // Filter communities
  const myCommunityIds = myCommunities.map((c) => c.id);

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "my") {
      return matchesSearch && myCommunityIds.includes(community.id);
    }
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <FaUsers className="text-primary" />
              Communities
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Discover and join developer communities
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <FaPlus className="w-4 h-4" />
              New Community
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              viewMode === "grid" ?
                "text-primary border-primary"
              : "text-white/40 border-transparent hover:text-white"
            }`}>
            Communities
          </button>
          <button
            onClick={() => {
              setViewMode("posts");
              fetchPosts({ limit: 10 });
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              viewMode === "posts" ?
                "text-primary border-primary"
              : "text-white/40 border-transparent hover:text-white"
            }`}>
            <FaComments className="w-3 h-3" />
            Recent Posts
          </button>
        </div>

        {
          viewMode === "posts" ?
            // Posts View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaComments className="text-primary" />
                  Recent Community Posts
                </h2>
                <Link
                  to="/posts"
                  className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                  View All Posts
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <PostsList
                posts={posts}
                loading={postsLoading}
                showCommunity={true}
              />
            </div>
            // Communities View
          : <>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      filter === "all" ?
                        "bg-primary text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}>
                    All
                  </button>
                  <button
                    onClick={() => setFilter("my")}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      filter === "my" ?
                        "bg-primary text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}>
                    My Communities
                  </button>
                </div>
              </div>

              {/* Communities Grid */}
              <CommunityGrid
                communities={filteredCommunities}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                showActions={true}
                myCommunityIds={myCommunityIds}
              />
            </>

        }

        {/* Create/Edit Modal */}
        <CreateCommunityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingCommunity ? handleUpdate : handleCreate}
          initialData={editingCommunity}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setCommunityToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Community"
          message={`Are you sure you want to delete "${communityToDelete?.name || "this community"}"? This action cannot be undone and will delete all associated posts and member data.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          loading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};
