import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ReadmeEditor } from "../components/readme/ReadmeEditor";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useReadmeProfile } from "../hooks/useReadmeProfile";
import { FaFileAlt, FaInfoCircle } from "react-icons/fa";

export const ReadmeProfilePage = () => {
  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    regenerate,
    exportReadme,
    toggleAutoUpdate,
    fetchPreview,
  } = useReadmeProfile();

  const [localContent, setLocalContent] = useState("");

  useEffect(() => {
    if (profile?.content) {
      setLocalContent(profile.content);
    }
  }, [profile]);

  const handleContentChange = (newContent) => {
    setLocalContent(newContent);
    // Auto-save after 2 seconds of inactivity
    clearTimeout(window._saveTimeout);
    window._saveTimeout = setTimeout(() => {
      updateProfile({ content: newContent });
    }, 2000);
  };

  const handleRegenerate = async () => {
    await regenerate();
    await fetchProfile();
  };

  const handleExport = async () => {
    await exportReadme();
  };

  const handleToggleAutoUpdate = async () => {
    await toggleAutoUpdate();
    await fetchProfile();
  };

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <FaFileAlt className="text-secondary flex-shrink-0" />
              README Profile
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Create and manage your GitHub profile README with dynamic
              analytics
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/70 min-w-0">
              <p>
                <strong>Placeholders:</strong> Use these in your content to
                automatically pull in live data:
              </p>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-white/60">
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{user.name}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{user.username}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{user.bio}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{stats.total_stars}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{stats.total_forks}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{stats.total_repos}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{languages.top_5}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{contributions.last_30_days.commits}}"}
                </code>
                <code className="break-all bg-white/5 rounded px-2 py-1">
                  {"{{current_date}}"}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <ReadmeEditor
          content={localContent}
          onContentChange={handleContentChange}
          onRegenerate={handleRegenerate}
          onExport={handleExport}
          loading={loading}
          lastGenerated={profile?.last_generated}
          autoUpdateEnabled={profile?.auto_update_enabled}
          onToggleAutoUpdate={handleToggleAutoUpdate}
          nextUpdate={profile?.next_update}
        />

        {/* Stats */}
        {profile && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-white/40 text-xs">Exports</p>
              <p className="text-white font-bold text-xl">
                {profile.export_count || 0}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-white/40 text-xs">Template</p>
              <p className="text-white font-bold text-xl capitalize">
                {profile.template || "modern"}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-white/40 text-xs">Auto-Update</p>
              <p
                className={`font-bold text-xl ${profile.auto_update_enabled ? "text-green-400" : "text-red-400"}`}>
                {profile.auto_update_enabled ? "On" : "Off"}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-white/40 text-xs">Last Generated</p>
              <p className="text-white font-bold text-sm">
                {profile.last_generated ?
                  new Date(profile.last_generated).toLocaleDateString()
                : "Never"}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
