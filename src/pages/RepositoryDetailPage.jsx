import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { repositoryService } from "../services/repositoryService";
import { Button } from "../components/common/Button";
import {
  FaStar,
  FaCodeBranch,
  FaEye,
  FaExclamationCircle,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaLink,
  FaLock,
  FaGlobe,
  FaArchive,
} from "react-icons/fa";

export const RepositoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const data = await repositoryService.getRepository(id);
        setRepository(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load repository");
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this repository?")) {
      return;
    }

    try {
      await repositoryService.deleteRepository(id);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete repository");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-darkest flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark to-darkest flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">{error || "Repository not found"}</p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-white/60 hover:text-white mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        {/* Repository Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {repository.name}
              </h1>
              <p className="text-white/60">{repository.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              {repository.homepage && (
                <a
                  href={repository.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white">
                  <FaLink className="w-5 h-5" />
                </a>
              )}
              <Link to={`/repositories/${id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FaEdit />
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex items-center gap-2">
                <FaTrash />
                Delete
              </Button>
            </div>
          </div>

          {repository.description && (
            <p className="text-white/80 mt-4 text-lg">
              {repository.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/60">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  repository.visibility === "public" ?
                    "bg-green-500/20 text-green-400"
                  : "bg-blue-500/20 text-blue-400"
                }`}>
                {repository.visibility === "private" ?
                  <FaLock className="inline mr-1" />
                : <FaGlobe className="inline mr-1" />}
                {repository.visibility}
              </span>
            </div>
            {repository.primary_language && (
              <span className="flex items-center gap-2 text-white/60">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                {repository.primary_language}
              </span>
            )}
            <span className="flex items-center gap-2 text-white/60">
              <FaStar className="text-yellow-400" />
              {repository.stars} stars
            </span>
            <span className="flex items-center gap-2 text-white/60">
              <FaCodeBranch className="text-blue-400" />
              {repository.forks} forks
            </span>
            <span className="flex items-center gap-2 text-white/60">
              <FaEye className="text-green-400" />
              {repository.watchers} watchers
            </span>
            {repository.open_issues > 0 && (
              <span className="flex items-center gap-2 text-red-400">
                <FaExclamationCircle />
                {repository.open_issues} open issues
              </span>
            )}
            {repository.archived && (
              <span className="flex items-center gap-2 text-yellow-400">
                <FaArchive />
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">
              Repository Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Default Branch</span>
                <span className="text-white">
                  {repository.default_branch || "main"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Size</span>
                <span className="text-white">{repository.size} KB</span>
              </div>
              {repository.license && (
                <div className="flex justify-between">
                  <span className="text-white/60">License</span>
                  <span className="text-white">{repository.license}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/60">Created</span>
                <span className="text-white">
                  {new Date(repository.created_at_github).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Last Updated</span>
                <span className="text-white">
                  {new Date(repository.updated_at_github).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Last Push</span>
                <span className="text-white">
                  {new Date(repository.pushed_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Watchers</span>
                <span className="text-white">{repository.watchers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Open Issues</span>
                <span className="text-white">{repository.open_issues}</span>
              </div>
              {repository.disabled && (
                <div className="text-red-400 text-sm mt-2">
                  ⚠️ This repository is disabled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
