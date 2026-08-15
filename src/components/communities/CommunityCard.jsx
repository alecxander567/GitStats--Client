import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaUserCheck,
} from "react-icons/fa";
import { getLanguageIcon, getLanguageColor } from "../../utils/languageIcons";

export const CommunityCard = ({
  community,
  onEdit,
  onDelete,
  showActions = false,
  isMember = false,
}) => {
  const {
    id,
    name,
    slug,
    description,
    language,
    created_by_display_name,
    created_by_username,
    created_at,
    member_count = 0,
  } = community;

  // Helper function to format time without date-fns
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

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
  };

  const languageIcon = getLanguageIcon(language, "w-10 h-10");
  const languageColor = getLanguageColor(language);

  // Use display name if available, otherwise fallback to username
  const creatorName =
    created_by_display_name || created_by_username || "Unknown";

  return (
    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      {/* Language Banner with Icon */}
      <div
        className={`relative h-32 bg-gradient-to-r ${languageColor} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-dark/80 rounded-2xl flex items-center justify-center border-2 border-white/20">
            {languageIcon}
          </div>
          {language && (
            <span className="text-white/80 text-xs mt-2 font-medium px-3 py-1 bg-dark/50 rounded-full border border-white/10">
              {language}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link to={`/communities/${slug}`}>
              <h3 className="text-lg font-bold text-white hover:text-primary transition-colors truncate">
                {name}
              </h3>
            </Link>
            <p className="text-white/60 text-sm truncate">by {creatorName}</p>
          </div>
          {showActions && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(community)}
                className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 transition-all"
                title="Edit">
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(community)}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all"
                title="Delete">
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-white/70 text-sm mt-2 line-clamp-2">
          {description || "No description provided"}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-white/60 text-sm">
              <FaUsers className="text-primary" />
              {member_count} members
            </span>
            <span className="flex items-center gap-2 text-white/60 text-sm">
              <FaCalendar className="text-secondary" />
              {timeAgo(created_at)}
            </span>
          </div>
          {isMember && (
            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <FaUserCheck className="w-3 h-3" />
              Member
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
