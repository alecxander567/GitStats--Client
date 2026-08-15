import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaFolderOpen,
  FaChartBar,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
  FaCode,
  FaUsers,
  FaUserFriends,
  FaTags,
  FaUsers as FaCommunitiesIcon,
  FaComments,
  FaFileAlt, // Add this import
} from "react-icons/fa";

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items with README Profile added
  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: FaHome },
    { name: "Repositories", path: "/repositories", icon: FaFolderOpen },
    { name: "Analytics", path: "/analytics", icon: FaChartBar },
    { name: "Languages", path: "/languages", icon: FaCode },
    { name: "Contributors", path: "/contributors", icon: FaUsers },
    { name: "Categories", path: "/project-categories", icon: FaTags },
    { name: "Communities", path: "/communities", icon: FaCommunitiesIcon },
    { name: "README Profile", path: "/readme-profile", icon: FaFileAlt }, // Add this
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header with Hamburger - shown below lg now, not just md */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-dark/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/stats_updater_logo_teal.svg"
            alt="Stats Updater"
            className="w-7 h-7 sm:w-8 sm:h-8"
          />
          <span className="text-base sm:text-lg font-bold text-white">
            GitStats
          </span>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="text-white/60 hover:text-white transition-colors p-2">
          {mobileMenuOpen ?
            <FaTimes className="w-6 h-6" />
          : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-dark/80 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer - capped at 85vw so it never overflows small phones */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 w-72 max-w-[85vw] h-full bg-dark/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex items-center gap-3 px-4 sm:px-6 py-6 border-b border-white/10">
          <img
            src="/stats_updater_logo_teal.svg"
            alt="Stats Updater"
            className="w-10 h-10 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xl font-bold text-white block leading-tight truncate">
              GitStats
            </span>
            <span className="text-sm text-white/40 truncate block">
              GitHub Stats Tracker
            </span>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || "User"}&background=6C63FF&color=fff&size=128`
              }
              alt={user?.display_name}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.display_name || user?.username}
              </p>
              {user?.email && (
                <p className="text-white/40 text-sm truncate">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path) ?
                        "bg-primary/20 text-primary"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/settings"
            onClick={toggleMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
            <FaCog className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar - now switches in at lg (1024px) instead of md (768px),
          so tablets in portrait get the mobile drawer instead of a cramped fixed sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-dark/95 backdrop-blur-xl border-r border-white/10 flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <img
            src="/stats_updater_logo_teal.svg"
            alt="Stats Updater"
            className="w-10 h-10 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xl font-bold text-white block leading-tight truncate">
              GitStats
            </span>
            <span className="text-sm text-white/40 truncate block">
              GitHub Stats Tracker
            </span>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || "User"}&background=6C63FF&color=fff&size=128`
              }
              alt={user?.display_name}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.display_name || user?.username}
              </p>
              {user?.email && (
                <p className="text-white/40 text-sm truncate">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path) ?
                        "bg-primary/20 text-primary"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
            <FaCog className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Header Spacer - must match header's h-16 exactly, shown below lg */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};
