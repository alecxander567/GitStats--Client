import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useCommunity } from "../hooks/useCommunity";
import { useCommunityMembers } from "../hooks/useCommunities";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import { UserSearchInput } from "../components/communities/UserSearchInput";
import { getLanguageIcon, getLanguageColor } from "../utils/languageIcons";
import {
  FaArrowLeft,
  FaUsers,
  FaCalendar,
  FaCode,
  FaUserPlus,
  FaCrown,
  FaShieldAlt,
  FaUserTag,
  FaUserTimes,
  FaTimes,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";

export const CommunityDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { community, loading, error, fetchCommunityBySlug } = useCommunity();
  const {
    members,
    loading: membersLoading,
    addMember,
    updateMemberRole,
    removeMember,
    fetchMembers,
  } = useCommunityMembers(community?.id);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCommunityBySlug(slug);
    }
  }, [slug, fetchCommunityBySlug]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const alreadyMember = members.some((m) => m.user_id === selectedUser.id);
    if (alreadyMember) {
      showAlert(
        `${selectedUser.display_name || selectedUser.username} is already a member of this community.`,
        "error",
      );
      return;
    }

    setActionLoading(true);
    try {
      await addMember(selectedUser.id, newMemberRole);
      setSelectedUser(null);
      setNewMemberRole("member");
      setShowAddMemberModal(false);
      showAlert("Member added successfully!", "success");
    } catch (err) {
      const backendMessage =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.message;
      showAlert(
        backendMessage || err.message || "Failed to add member",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${memberName} from this community?`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await removeMember(memberId);
      showAlert("Member removed successfully!", "success");
    } catch (err) {
      showAlert(err.message || "Failed to remove member", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (memberId, role) => {
    try {
      await updateMemberRole(memberId, role);
      showAlert("Role updated successfully!", "success");
    } catch (err) {
      showAlert(err.message || "Failed to update role", "error");
    }
  };

  const isOwner =
    community?.created_by_id === user?.id ||
    members.some((m) => m.user_id === user?.id && m.role === "owner");
  const isModerator = members.some(
    (m) => m.user_id === user?.id && m.role === "moderator",
  );
  const canManageMembers = isOwner || isModerator;
  const isMember = members.some((m) => m.user_id === user?.id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !community) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Community Not Found
          </h2>
          <p className="text-white/60 mb-6">
            {error || "The community you're looking for doesn't exist."}
          </p>
          <Link to="/communities">
            <Button>Back to Communities</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const languageIcon = getLanguageIcon(community.language, "w-20 h-20");
  const languageColor = getLanguageColor(community.language);

  const creatorName =
    community.created_by_display_name ||
    community.created_by_username ||
    "Unknown";

  const roleColors = {
    owner: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    moderator: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    member: "text-green-400 bg-green-400/10 border-green-400/20",
  };

  const roleIcons = {
    owner: <FaCrown className="w-4 h-4 text-amber-400" />,
    moderator: <FaShieldAlt className="w-4 h-4 text-blue-400" />,
    member: <FaUserTag className="w-4 h-4 text-green-400" />,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
          <FaArrowLeft className="w-4 h-4" />
          Back to Communities
        </Link>

        {/* Language Banner */}
        <div
          className={`relative min-h-[280px] md:min-h-[320px] rounded-2xl overflow-hidden border border-white/20 mb-8 bg-gradient-to-r ${languageColor}`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px] px-6 py-8">
            <div className="bg-dark/80 p-6 rounded-2xl border-2 border-white/20 shadow-2xl shadow-black/50">
              {languageIcon}
            </div>

            {community.language && (
              <div className="mt-4 flex items-center gap-2 bg-dark/80 px-5 py-2.5 rounded-full border border-white/20 shadow-lg shadow-black/30">
                <FaCode className="text-white/60 w-4 h-4" />
                <span className="text-white font-medium">
                  {community.language}
                </span>
              </div>
            )}

            <div className="mt-5 text-center">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                {community.name}
              </h1>
              <p className="text-white/70 text-sm md:text-base mt-1.5 drop-shadow-md">
                Created by {creatorName}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3">About</h2>
              <p className="text-white/70 leading-relaxed">
                {community.description || "No description provided."}
              </p>
            </div>

            {/* Posts Redirect Button */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <FaComments className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Community Posts
                    </h2>
                    <p className="text-white/60 text-sm">
                      View and discuss community topics
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/communities/${slug}/posts`)}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary">
                  <span>View Posts</span>
                  <FaArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Members */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaUsers className="text-primary" />
                  Members
                </h2>
                {canManageMembers && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-all text-sm">
                    <FaUserPlus className="w-4 h-4" />
                    Add Member
                  </button>
                )}
              </div>

              {membersLoading ?
                <div className="text-center py-4 text-white/40">
                  Loading members...
                </div>
              : members.length === 0 ?
                <div className="text-center py-4 text-white/40">
                  No members yet
                </div>
              : <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            member.avatar_url ||
                            `https://ui-avatars.com/api/?name=${member.display_name || member.username}&background=6C63FF&color=fff&size=64`
                          }
                          alt={member.username}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${member.display_name || member.username}&background=6C63FF&color=fff&size=64`;
                          }}
                        />
                        <div>
                          <p className="text-white font-medium">
                            {member.display_name || member.username}
                          </p>
                          <p className="text-white/40 text-sm">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canManageMembers && member.user_id !== user?.id ?
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateRole(member.id, e.target.value)
                            }
                            className="bg-white/5 border border-white/10 rounded-lg text-sm text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option value="owner">Owner</option>
                            <option value="moderator">Moderator</option>
                            <option value="member">Member</option>
                          </select>
                        : <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${roleColors[member.role]}`}>
                            {roleIcons[member.role]}
                            {member.role_display || member.role}
                          </span>
                        }
                        {canManageMembers && member.user_id !== user?.id && (
                          <button
                            onClick={() =>
                              handleRemoveMember(member.id, member.username)
                            }
                            className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                            <FaUserTimes className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Members</span>
                  <span className="text-white font-bold">{members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Created</span>
                  <span className="text-white text-sm">
                    {new Date(community.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Language</span>
                  <span className="text-white flex items-center gap-1">
                    {getLanguageIcon(community.language, "w-4 h-4")}
                    {community.language || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Status */}
            {user && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  Your Status
                </h3>
                {isMember ?
                  <div className="text-white">
                    <p className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      You are a member
                    </p>
                    {members.find((m) => m.user_id === user.id)?.role && (
                      <p className="text-sm text-white/60 mt-1">
                        Role:{" "}
                        {members.find((m) => m.user_id === user.id)
                          ?.role_display ||
                          members.find((m) => m.user_id === user.id)?.role}
                      </p>
                    )}
                  </div>
                : <div className="text-white/60">
                    <p>You are not a member of this community</p>
                  </div>
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Add Member</h3>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedUser(null);
                  setNewMemberRole("member");
                }}
                className="text-white/40 hover:text-white transition-all">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Search User *
                  </label>
                  <UserSearchInput
                    onSelect={setSelectedUser}
                    selectedUser={selectedUser}
                    onClear={() => setSelectedUser(null)}
                    existingMembers={members}
                  />
                  <p className="text-white/30 text-xs mt-1">
                    Type at least 2 characters to search
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Role
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="owner">Owner</option>
                    <option value="moderator">Moderator</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSelectedUser(null);
                    setNewMemberRole("member");
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedUser}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {actionLoading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
