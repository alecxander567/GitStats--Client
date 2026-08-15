import React, { useState } from "react";
import { CategoryBadge } from "./CategoryBadge";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSync,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const CATEGORY_OPTIONS = [
  "Web",
  "Mobile",
  "Desktop",
  "AI",
  "API",
  "CLI",
  "IoT",
  "Game",
  "Library",
  "Other",
];

export const CategoryManager = ({
  categories,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  onRecalculate,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState("");
  const [editingConfidence, setEditingConfidence] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newConfidence, setNewConfidence] = useState("");

  const handleAdd = async () => {
    if (!newCategory || !newConfidence) return;
    const confidence = parseFloat(newConfidence);
    if (isNaN(confidence) || confidence < 0 || confidence > 100) return;

    await onAdd({
      category: newCategory,
      confidence: confidence,
    });
    setNewCategory("");
    setNewConfidence("");
    setShowAddForm(false);
  };

  const handleUpdate = async (id) => {
    if (!editingCategory || !editingConfidence) return;
    const confidence = parseFloat(editingConfidence);
    if (isNaN(confidence) || confidence < 0 || confidence > 100) return;

    await onUpdate(id, {
      category: editingCategory,
      confidence: confidence,
    });
    setEditingId(null);
    setEditingCategory("");
    setEditingConfidence("");
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingCategory(category.category);
    setEditingConfidence(category.confidence.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingCategory("");
    setEditingConfidence("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-white font-medium">Project Categories</h4>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="flex items-center gap-2">
          <FaPlus className="w-3 h-3" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none">
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Confidence (0-100)"
              value={newConfidence}
              onChange={(e) => setNewConfidence(e.target.value)}
              min="0"
              max="100"
              step="0.01"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2">
              <FaCheck className="w-3 h-3" />
              Add
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2">
              <FaTimes className="w-3 h-3" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 ?
          <div className="text-center py-8 text-white/40">
            <p>No categories assigned to this repository</p>
          </div>
        : categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all gap-3">
              {
                editingId === category.id ?
                  // Edit Mode
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editingConfidence}
                      onChange={(e) => setEditingConfidence(e.target.value)}
                      min="0"
                      max="100"
                      step="0.01"
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                    <div className="flex gap-2 sm:col-span-2">
                      <Button
                        onClick={() => handleUpdate(category.id)}
                        size="sm"
                        className="flex items-center gap-2">
                        <FaCheck className="w-3 h-3" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2">
                        <FaTimes className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  // View Mode
                : <>
                    <div className="flex items-center gap-3">
                      <CategoryBadge
                        category={category.category}
                        confidence={category.confidence}
                        size="md"
                        showConfidence={true}
                      />
                      <span className="text-white/40 text-xs">
                        ID: {category.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => startEditing(category)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1">
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => onRecalculate(category.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1">
                        <FaSync className="w-3 h-3" />
                        Recalc
                      </Button>
                      <Button
                        onClick={() => onDelete(category.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-400 hover:text-red-300">
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </>

              }
            </div>
          ))
        }
      </div>
    </div>
  );
};
