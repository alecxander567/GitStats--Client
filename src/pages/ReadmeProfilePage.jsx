import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ReadmeEditor } from "../components/readme/ReadmeEditor";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useReadmeProfile } from "../hooks/useReadmeProfile";
import { FaFileAlt, FaInfoCircle } from "react-icons/fa";

// Mirrors ReadmeGenerator.get_default_template() on the backend. Shown in
// the Edit tab whenever profile.content is empty, so the textarea never
// just sits blank with nothing to work from - matches what actually gets
// used for generation when content is empty anyway.
const DEFAULT_TEMPLATE = `<div align="center">

# {{user.name}}

{{user.bio}}

**Location:** {{user.location}} &nbsp;|&nbsp; **Company:** {{user.company}} &nbsp;|&nbsp; **Blog:** {{user.blog}}

</div>

---

## GitHub Stats

![GitHub Stats]({{stats_card_url}})

### Activity Summary

| Metric | Count |
|---|---|
| Total Repositories | {{stats.total_repos}} |
| Total Stars Received | {{stats.total_stars}} |
| Total Forks | {{stats.total_forks}} |
| Public Repos | {{stats.public_repos}} |
| Private Repos | {{stats.private_repos}} |

### Top Languages

{{languages.top_5}}

### Recent Activity (Last 30 Days)

| Type | Count |
|---|---|
| Commits | {{contributions.last_30_days.commits}} |
| Pull Requests | {{contributions.last_30_days.prs}} |
| Issues | {{contributions.last_30_days.issues}} |

---

<div align="center">

From [{{user.username}}](https://github.com/{{user.username}})

_Last updated: {{current_date}}_

</div>
`;

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

  // localContent = the raw editable template (with {{placeholders}}).
  // generatedContent = the last fully-resolved output from the backend
  // (badges/images/tables filled in). These are two different things now -
  // profile.content is never overwritten by generation anymore, so the
  // Preview tab needs to read profile.generated_content, not localContent.
  const [localContent, setLocalContent] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  useEffect(() => {
    if (profile?.content) {
      setLocalContent(profile.content);
    } else if (profile !== undefined && profile !== null) {
      // content is empty - show the default template instead of a blank
      // box, and save it back so future loads have something real stored.
      setLocalContent(DEFAULT_TEMPLATE);
      updateProfile({ content: DEFAULT_TEMPLATE });
    }
    if (profile?.generated_content !== undefined) {
      setGeneratedContent(profile.generated_content);
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
    // Flush any pending auto-save immediately instead of waiting for the
    // 2s debounce - without this, clicking Regenerate right after typing
    // (before the debounce fires) generates from the OLD saved content,
    // not what's actually in the textarea. That's why edits sometimes
    // "don't show up" after Regenerate.
    clearTimeout(window._saveTimeout);
    await updateProfile({ content: localContent });
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
          generatedContent={generatedContent}
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
