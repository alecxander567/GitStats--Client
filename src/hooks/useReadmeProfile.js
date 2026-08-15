import { useState, useEffect, useCallback } from "react";
import readmeService from "../services/readmeService";
import { useAlert } from "../contexts/AlertContext";

export const useReadmeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const { showAlert } = useAlert();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await readmeService.getProfile();
      setProfile(data);
      return data;
    } catch (error) {
      showAlert(
        error.response?.data?.detail || "Failed to load README profile",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const updateProfile = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const updated = await readmeService.updateProfile(data);
        setProfile(updated);
        showAlert("README profile updated successfully!");
        return updated;
      } catch (error) {
        showAlert(
          error.response?.data?.detail || "Failed to update README profile",
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showAlert],
  );

  const regenerate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await readmeService.regenerate();
      showAlert("README regenerated successfully!");
      return result;
    } catch (error) {
      showAlert(error.response?.data?.detail || "Failed to regenerate README");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const exportReadme = useCallback(async () => {
    setLoading(true);
    try {
      const response = await readmeService.exportReadme();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `README_${profile?.username || "profile"}.md`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showAlert("README exported successfully!");
      return true;
    } catch (error) {
      showAlert(error.response?.data?.detail || "Failed to export README");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [profile, showAlert]);

  const toggleAutoUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await readmeService.toggleAutoUpdate();
      setProfile((prev) => ({
        ...prev,
        auto_update_enabled: result.auto_update_enabled,
        next_update: result.next_update,
      }));
      showAlert(
        `Auto-update ${result.auto_update_enabled ? "enabled" : "disabled"}`,
      );
      return result;
    } catch (error) {
      showAlert(error.response?.data?.detail || "Failed to toggle auto-update");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchPreview = useCallback(async () => {
    setLoading(true);
    try {
      const data = await readmeService.preview();
      setPreview(data);
      return data;
    } catch (error) {
      showAlert(error.response?.data?.detail || "Failed to load preview");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await readmeService.getHistory();
      setHistory(data);
      return data;
    } catch (error) {
      console.error("Failed to load history:", error);
      throw error;
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await readmeService.getTemplates();
      setTemplates(data);
      return data;
    } catch (error) {
      console.error("Failed to load templates:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchTemplates();
    fetchHistory();
  }, []);

  return {
    profile,
    loading,
    preview,
    history,
    templates,
    fetchProfile,
    updateProfile,
    regenerate,
    exportReadme,
    toggleAutoUpdate,
    fetchPreview,
    fetchHistory,
    fetchTemplates,
  };
};
