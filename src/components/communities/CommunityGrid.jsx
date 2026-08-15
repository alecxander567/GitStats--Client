import React from "react";
import { CommunityCard } from "./CommunityCard";
import { FaInbox } from "react-icons/fa";

export const CommunityGrid = ({
  communities,
  loading,
  onEdit,
  onDelete,
  showActions = false,
  myCommunityIds = [],
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-white/10"></div>
            <div className="p-4 pt-8">
              <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <FaInbox className="text-6xl text-white/20" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">
          No Communities Yet
        </h3>
        <p className="text-white/60">
          Be the first to create a community for developers!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
          isMember={myCommunityIds.includes(community.id)}
        />
      ))}
    </div>
  );
};
