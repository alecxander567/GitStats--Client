import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  FaMarkdown,
  FaEye,
  FaCode,
  FaSync,
  FaDownload,
  FaClock,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const ReadmeEditor = ({
  content,
  generatedContent,
  onContentChange,
  onRegenerate,
  onExport,
  loading,
  lastGenerated,
  autoUpdateEnabled,
  onToggleAutoUpdate,
  nextUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("preview"); // default to the finished, ready-to-copy view
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!generatedContent) return;
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === "edit" ?
                  "bg-primary text-white"
                : "text-white/60 hover:text-white"
              }`}>
              <FaCode className="inline mr-2" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === "preview" ?
                  "bg-primary text-white"
                : "text-white/60 hover:text-white"
              }`}>
              <FaEye className="inline mr-2" />
              Preview
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            onClick={onToggleAutoUpdate}
            variant={autoUpdateEnabled ? "primary" : "outline"}
            size="sm"
            className="flex items-center gap-2">
            <FaClock className="w-3 h-3" />
            {autoUpdateEnabled ? "Auto-Update On" : "Auto-Update Off"}
          </Button>
          <Button
            onClick={onRegenerate}
            disabled={loading}
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary">
            <FaSync className={loading ? "animate-spin w-3 h-3" : "w-3 h-3"} />
            Regenerate
          </Button>
          <Button
            onClick={handleCopy}
            disabled={loading || !generatedContent}
            size="sm"
            variant="outline"
            className="flex items-center gap-2">
            {copied ?
              <FaCheck className="w-3 h-3 text-green-400" />
            : <FaCopy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy README"}
          </Button>
          <Button
            onClick={onExport}
            disabled={loading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2">
            <FaDownload className="w-3 h-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "edit" ?
          <div>
            <div className="mb-2 text-xs text-white/40 flex items-center gap-2">
              <FaMarkdown className="w-3 h-3" />
              Use placeholders: {"{{user.name}}"}, {"{{stats.total_stars}}"},{" "}
              {"{{languages.top_5}}"}, etc.
            </div>
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full h-[400px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              placeholder="Write your README content here with placeholders..."
              disabled={loading}
            />
            {lastGenerated && (
              <div className="mt-2 text-xs text-white/40">
                Last generated: {new Date(lastGenerated).toLocaleString()}
                {nextUpdate && autoUpdateEnabled && (
                  <span className="ml-4">
                    Next update: {new Date(nextUpdate).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        : <div className="h-[400px] overflow-y-auto bg-white/5 rounded-xl p-4">
            {loading ?
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
              </div>
            : generatedContent ?
              // Preview shows the resolved output (badges/images/tables
              // filled in), rendered as actual markdown - not the raw
              // editable template, and not dumped as plain text.
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {generatedContent}
                </ReactMarkdown>
              </div>
            : <div className="flex items-center justify-center h-full text-white/40 text-sm text-center px-4">
                No preview yet. Click Regenerate to generate your README from
                the current content.
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
};
