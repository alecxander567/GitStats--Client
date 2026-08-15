import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { api } from "../../services/api";

export const UserSearchInput = ({
  onSelect,
  selectedUser,
  onClear,
  existingMembers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Search users from API
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setUsers([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use the /users/list/ endpoint as defined in urls.py
        const response = await api.get(
          `/users/list/?q=${encodeURIComponent(searchTerm)}`,
        );

        const apiUsers = response.data.map((user) => ({
          id: user.id,
          username: user.username || "Unknown",
          email: user.email || "",
          display_name: user.display_name || user.username,
          avatar_url:
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.display_name || user.username}&background=6C63FF&color=fff&size=64`,
        }));
        setUsers(apiUsers);
        setShowDropdown(apiUsers.length > 0);
      } catch (err) {
        console.error("Error searching users:", err);
        // Fallback to existing members if API fails
        if (existingMembers.length > 0) {
          const filtered = filterExistingMembers(searchTerm);
          setUsers(filtered);
          setShowDropdown(filtered.length > 0);
        } else {
          setError("Failed to search users");
        }
      } finally {
        setLoading(false);
      }
    };

    const filterExistingMembers = (term) => {
      const searchLower = term.toLowerCase();
      return existingMembers
        .map((member) => ({
          id: member.user_id || member.user,
          username:
            member.username || member.user_details?.username || "Unknown",
          email: member.email || member.user_details?.email || "",
          display_name:
            member.user_details?.display_name ||
            member.display_name ||
            member.username,
          avatar_url:
            member.user_details?.avatar_url ||
            `https://ui-avatars.com/api/?name=${member.username || "User"}&background=6C63FF&color=fff&size=64`,
        }))
        .filter(
          (user) =>
            (user.username &&
              user.username.toLowerCase().includes(searchLower)) ||
            (user.display_name &&
              user.display_name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower)),
        )
        .slice(0, 20);
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, existingMembers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    onSelect(user);
    setSearchTerm("");
    setUsers([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setUsers([]);
    setShowDropdown(false);
    if (onClear) onClear();
  };

  // If a user is selected, show their info
  if (selectedUser) {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
        <img
          src={
            selectedUser.avatar_url ||
            `https://ui-avatars.com/api/?name=${selectedUser.display_name || selectedUser.username}&background=6C63FF&color=fff&size=64`
          }
          alt={selectedUser.display_name || selectedUser.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-white font-medium">
            {selectedUser.display_name || selectedUser.username}
          </p>
          <p className="text-white/40 text-sm">{selectedUser.email}</p>
        </div>
        <button
          onClick={handleClear}
          className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
          type="button">
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative" ref={inputRef}>
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            existingMembers.length > 0 ?
              "Search existing members or all users..."
            : "Search users by name or email..."
          }
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          onFocus={() => {
            if (searchTerm.length >= 2 && users.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
            type="button">
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="absolute z-50 w-full mt-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="absolute z-50 w-full mt-2 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 text-center text-white/40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Searching users...
        </div>
      )}

      {showDropdown && !loading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
          {users.length === 0 ?
            <div className="p-4 text-center text-white/40">
              {searchTerm.length < 2 ?
                "Type at least 2 characters"
              : "No users found"}
            </div>
          : <div className="py-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all text-left">
                  <img
                    src={
                      user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user.display_name || user.username}&background=6C63FF&color=fff&size=64`
                    }
                    alt={user.display_name || user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-white/40 text-sm truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
};
