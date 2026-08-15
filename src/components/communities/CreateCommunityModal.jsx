import React, { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { Button } from "../common/Button";
import { getLanguageIcon, getLanguageColor } from "../../utils/languageIcons";

// Common programming languages for the dropdown
const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "React",
  "Vue",
  "Angular",
  "Docker",
  "Shell",
  "Scala",
  "Perl",
  "Lua",
  "Elixir",
  "Clojure",
  "Haskell",
  "Julia",
  "R",
  "Dart",
  "Flutter",
  "Solidity",
  "GraphQL",
  "HTML",
  "CSS",
];

export const CreateCommunityModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    language: initialData?.language || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!initialData;
  const selectedLanguage = formData.language;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save community");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
      <div className="bg-dark/95 rounded-2xl border border-white/20 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Community" : "Create New Community"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Community Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="e.g., Python Developers"
              required
              minLength={3}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Describe your community..."
              rows={3}
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Primary Language
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "#1a1a2e",
                    color: "#ffffff",
                  }}>
                  <option value="" className="bg-dark text-white/60">
                    Select a language...
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={lang}
                      value={lang}
                      className="bg-dark text-white hover:bg-primary/20"
                      style={{
                        backgroundColor: "#1a1a2e",
                        color: "#ffffff",
                        padding: "8px",
                      }}>
                      {lang}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {selectedLanguage && (
                <div
                  className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getLanguageColor(selectedLanguage)} flex items-center justify-center min-w-[50px]`}>
                  {getLanguageIcon(selectedLanguage, "w-6 h-6")}
                </div>
              )}
            </div>
            <p className="text-white/40 text-xs mt-1">
              Select the primary programming language for your community
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ?
                "Saving..."
              : isEditing ?
                "Update"
              : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
