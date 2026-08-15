import React, { useState } from "react";
import { Button } from "../common/Button";

export const CommunityForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    cover_image: initialData?.cover_image || "",
    icon: initialData?.icon || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Community Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          rows={4}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          value={formData.cover_image}
          onChange={(e) =>
            setFormData({ ...formData, cover_image: e.target.value })
          }
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Icon URL
        </label>
        <input
          type="url"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
          placeholder="https://example.com/icon.png"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ?
            "Saving..."
          : initialData ?
            "Update"
          : "Create"}
        </Button>
      </div>
    </form>
  );
};
