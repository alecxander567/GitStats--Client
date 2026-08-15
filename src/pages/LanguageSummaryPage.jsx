import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { languageService } from "../services/languageService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useRepositories } from "../hooks/useRepositories";
import {
  FaPython,
  FaJs,
  FaReact,
  FaJava,
  FaPhp,
  FaRust,
  FaSwift,
  FaGem,
  FaCuttlefish,
  FaHtml5,
  FaCss3Alt,
  FaVuejs,
  FaAngular,
  FaDocker,
  FaTerminal,
  FaCode,
  FaCodeBranch,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import {
  SiTypescript,
  SiGo,
  SiRuby,
  SiKotlin,
  SiScala,
  SiPerl,
  SiLua,
  SiElixir,
  SiClojure,
  SiHaskell,
  SiJulia,
  SiR,
  SiDart,
  SiFlutter,
  SiSolidity,
  SiGraphql,
} from "react-icons/si";

export const LanguageSummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("repos-desc"); // Default sort

  // Get repositories to calculate total count
  const { repositories, loading: reposLoading } = useRepositories();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await languageService.getLanguageSummary();
        console.log("Language summary data:", data); // Debug log

        // Handle the response
        let languages = [];
        let totalLanguages = 0;

        if (data) {
          if (Array.isArray(data)) {
            languages = data;
            totalLanguages = data.length;
          } else if (data.summary && Array.isArray(data.summary)) {
            languages = data.summary;
            totalLanguages = data.total_languages_used || data.summary.length;
          } else if (data.language) {
            languages = [data];
            totalLanguages = 1;
          }
        }

        setSummary({
          summary: languages,
          total_languages_used: totalLanguages,
          total_bytes: languages.reduce(
            (sum, lang) => sum + (lang.total_bytes || 0),
            0,
          ),
        });
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError(err.message || "Failed to load language summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Sort languages based on selected option
  const getSortedLanguages = () => {
    if (!summary?.summary) return [];

    const languages = [...summary.summary];

    switch (sortBy) {
      case "repos-desc":
        return languages.sort(
          (a, b) => (b.total_repositories || 0) - (a.total_repositories || 0),
        );
      case "repos-asc":
        return languages.sort(
          (a, b) => (a.total_repositories || 0) - (b.total_repositories || 0),
        );
      case "bytes-desc":
        return languages.sort(
          (a, b) => (b.total_bytes || 0) - (a.total_bytes || 0),
        );
      case "bytes-asc":
        return languages.sort(
          (a, b) => (a.total_bytes || 0) - (b.total_bytes || 0),
        );
      case "name-asc":
        return languages.sort((a, b) =>
          (a.language || "").localeCompare(b.language || ""),
        );
      case "name-desc":
        return languages.sort((a, b) =>
          (b.language || "").localeCompare(a.language || ""),
        );
      default:
        return languages;
    }
  };

  const getLanguageIcon = (language) => {
    if (!language) return <FaCode className="text-white/40 text-3xl" />;

    const lang = language.toLowerCase().trim();

    // Exact matches for special cases
    if (lang === "c#" || lang === "csharp") {
      return <span className="text-purple-400 font-bold text-xl">C#</span>;
    }
    if (lang === "c++" || lang === "cpp") {
      return <span className="text-blue-500 font-bold text-xl">C++</span>;
    }
    if (lang === "c") {
      return <FaCuttlefish className="text-blue-400 text-3xl" />;
    }

    // Define language icon mappings - exact matches first
    const exactMatchIcons = {
      python: <FaPython className="text-blue-400 text-3xl" />,
      javascript: <FaJs className="text-yellow-400 text-3xl" />,
      typescript: <SiTypescript className="text-blue-500 text-3xl" />,
      react: <FaReact className="text-cyan-400 text-3xl" />,
      vue: <FaVuejs className="text-green-400 text-3xl" />,
      angular: <FaAngular className="text-red-400 text-3xl" />,
      java: <FaJava className="text-red-500 text-3xl" />,
      php: <FaPhp className="text-purple-400 text-3xl" />,
      ruby: <FaGem className="text-red-400 text-3xl" />,
      go: <SiGo className="text-cyan-400 text-3xl" />,
      rust: <FaRust className="text-orange-400 text-3xl" />,
      swift: <FaSwift className="text-orange-500 text-3xl" />,
      kotlin: <SiKotlin className="text-purple-500 text-3xl" />,
      html: <FaHtml5 className="text-orange-500 text-3xl" />,
      css: <FaCss3Alt className="text-blue-400 text-3xl" />,
      dockerfile: <FaDocker className="text-blue-400 text-3xl" />,
      shell: <FaTerminal className="text-green-400 text-3xl" />,
      bash: <FaTerminal className="text-green-400 text-3xl" />,
      scala: <SiScala className="text-red-500 text-3xl" />,
      perl: <SiPerl className="text-blue-400 text-3xl" />,
      lua: <SiLua className="text-blue-500 text-3xl" />,
      elixir: <SiElixir className="text-purple-500 text-3xl" />,
      clojure: <SiClojure className="text-blue-500 text-3xl" />,
      haskell: <SiHaskell className="text-purple-500 text-3xl" />,
      julia: <SiJulia className="text-purple-500 text-3xl" />,
      r: <SiR className="text-blue-400 text-3xl" />,
      dart: <SiDart className="text-blue-500 text-3xl" />,
      flutter: <SiFlutter className="text-blue-400 text-3xl" />,
      solidity: <SiSolidity className="text-gray-400 text-3xl" />,
      graphql: <SiGraphql className="text-pink-400 text-3xl" />,
    };

    // Check exact match first
    if (exactMatchIcons[lang]) {
      return exactMatchIcons[lang];
    }

    // Check partial matches (but be careful not to match "procfile" with "r")
    const partialMatchIcons = {
      python: <FaPython className="text-blue-400 text-3xl" />,
      javascript: <FaJs className="text-yellow-400 text-3xl" />,
      typescript: <SiTypescript className="text-blue-500 text-3xl" />,
      react: <FaReact className="text-cyan-400 text-3xl" />,
      vue: <FaVuejs className="text-green-400 text-3xl" />,
      angular: <FaAngular className="text-red-400 text-3xl" />,
      java: <FaJava className="text-red-500 text-3xl" />,
      php: <FaPhp className="text-purple-400 text-3xl" />,
      ruby: <FaGem className="text-red-400 text-3xl" />,
      go: <SiGo className="text-cyan-400 text-3xl" />,
      rust: <FaRust className="text-orange-400 text-3xl" />,
      swift: <FaSwift className="text-orange-500 text-3xl" />,
      kotlin: <SiKotlin className="text-purple-500 text-3xl" />,
      html: <FaHtml5 className="text-orange-500 text-3xl" />,
      css: <FaCss3Alt className="text-blue-400 text-3xl" />,
      docker: <FaDocker className="text-blue-400 text-3xl" />,
      shell: <FaTerminal className="text-green-400 text-3xl" />,
      bash: <FaTerminal className="text-green-400 text-3xl" />,
      scala: <SiScala className="text-red-500 text-3xl" />,
      perl: <SiPerl className="text-blue-400 text-3xl" />,
      lua: <SiLua className="text-blue-500 text-3xl" />,
      elixir: <SiElixir className="text-purple-500 text-3xl" />,
      clojure: <SiClojure className="text-blue-500 text-3xl" />,
      haskell: <SiHaskell className="text-purple-500 text-3xl" />,
      julia: <SiJulia className="text-purple-500 text-3xl" />,
      // Don't match "r" partially - only exact match for "r" language
      dart: <SiDart className="text-blue-500 text-3xl" />,
      flutter: <SiFlutter className="text-blue-400 text-3xl" />,
      solidity: <SiSolidity className="text-gray-400 text-3xl" />,
      graphql: <SiGraphql className="text-pink-400 text-3xl" />,
    };

    // Check partial matches (but only if the language name is longer than 2 characters
    // to avoid matching "procfile" with "r")
    if (lang.length > 2) {
      for (const [key, icon] of Object.entries(partialMatchIcons)) {
        if (lang.includes(key)) {
          return icon;
        }
      }
    }

    // Check for common file extensions or special cases
    if (lang.includes("script") || lang.includes("markdown")) {
      return <FaCode className="text-white/40 text-3xl" />;
    }

    // Default fallback
    return <FaCode className="text-white/40 text-3xl" />;
  };

  const getLanguageColor = (language) => {
    if (!language) return "from-gray-500/20 to-gray-600/20";

    const lang = language.toLowerCase().trim();

    // Exact match colors
    const exactColors = {
      python: "from-blue-400/20 to-blue-600/20",
      javascript: "from-yellow-400/20 to-yellow-600/20",
      typescript: "from-blue-500/20 to-blue-700/20",
      react: "from-cyan-400/20 to-cyan-600/20",
      vue: "from-green-400/20 to-green-600/20",
      angular: "from-red-400/20 to-red-600/20",
      java: "from-red-500/20 to-red-700/20",
      php: "from-purple-400/20 to-purple-600/20",
      ruby: "from-red-400/20 to-red-600/20",
      go: "from-cyan-400/20 to-cyan-600/20",
      rust: "from-orange-400/20 to-orange-600/20",
      swift: "from-orange-500/20 to-orange-700/20",
      kotlin: "from-purple-500/20 to-purple-700/20",
      c: "from-blue-400/20 to-blue-600/20",
      "c++": "from-blue-500/20 to-blue-700/20",
      "c#": "from-purple-400/20 to-purple-600/20",
      html: "from-orange-500/20 to-orange-700/20",
      css: "from-blue-400/20 to-blue-600/20",
      dockerfile: "from-blue-400/20 to-blue-600/20",
      shell: "from-green-400/20 to-green-600/20",
      bash: "from-green-400/20 to-green-600/20",
    };

    if (exactColors[lang]) {
      return exactColors[lang];
    }

    // Partial match colors (only for languages longer than 2 chars)
    const partialColors = {
      python: "from-blue-400/20 to-blue-600/20",
      javascript: "from-yellow-400/20 to-yellow-600/20",
      typescript: "from-blue-500/20 to-blue-700/20",
      react: "from-cyan-400/20 to-cyan-600/20",
      vue: "from-green-400/20 to-green-600/20",
      angular: "from-red-400/20 to-red-600/20",
      java: "from-red-500/20 to-red-700/20",
      php: "from-purple-400/20 to-purple-600/20",
      ruby: "from-red-400/20 to-red-600/20",
      go: "from-cyan-400/20 to-cyan-600/20",
      rust: "from-orange-400/20 to-orange-600/20",
      swift: "from-orange-500/20 to-orange-700/20",
      kotlin: "from-purple-500/20 to-purple-700/20",
      html: "from-orange-500/20 to-orange-700/20",
      css: "from-blue-400/20 to-blue-600/20",
      docker: "from-blue-400/20 to-blue-600/20",
      shell: "from-green-400/20 to-green-600/20",
      bash: "from-green-400/20 to-green-600/20",
    };

    if (lang.length > 2) {
      for (const [key, color] of Object.entries(partialColors)) {
        if (lang.includes(key)) {
          return color;
        }
      }
    }

    return "from-primary/20 to-secondary/20";
  };

  if (loading || reposLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          Error loading language summary: {error}
        </div>
      </DashboardLayout>
    );
  }

  const languages = getSortedLanguages();
  const totalLanguages = languages.length;
  const totalRepositories = repositories?.length || 0;

  // Get the maximum repositories for progress bar
  const maxRepos =
    languages.length > 0 ?
      Math.max(...languages.map((l) => l.total_repositories || 0))
    : 1;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaCode className="text-secondary" />
            My Languages
          </h1>
          <p className="text-white/60 mt-1">
            {totalLanguages} programming languages used across your repositories
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white/40 text-sm">Total Languages</p>
            <p className="text-2xl font-bold text-white">{totalLanguages}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white/40 text-sm">Total Repositories</p>
            <p className="text-2xl font-bold text-white">{totalRepositories}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white/40 text-sm">Most Used Language</p>
            <p className="text-2xl font-bold text-white">
              {languages.length > 0 ? languages[0]?.language : "N/A"}
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <FaSort className="w-4 h-4" />
            <span>Sort by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy("repos-desc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "repos-desc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              <FaSortAmountDown className="w-3 h-3" />
              Most Repos
            </button>
            <button
              onClick={() => setSortBy("repos-asc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "repos-asc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              <FaSortAmountUp className="w-3 h-3" />
              Least Repos
            </button>
            <button
              onClick={() => setSortBy("bytes-desc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "bytes-desc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              <FaSortAmountDown className="w-3 h-3" />
              Most Bytes
            </button>
            <button
              onClick={() => setSortBy("bytes-asc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "bytes-asc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              <FaSortAmountUp className="w-3 h-3" />
              Least Bytes
            </button>
            <button
              onClick={() => setSortBy("name-asc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "name-asc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              A → Z
            </button>
            <button
              onClick={() => setSortBy("name-desc")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                sortBy === "name-desc" ?
                  "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
              }`}>
              Z → A
            </button>
          </div>
        </div>

        {/* Language Cards Grid */}
        {languages.length === 0 ?
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
            <FaCode className="text-5xl text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No languages found</p>
            <p className="text-white/20 text-sm mt-2">
              Sync your repositories to see languages
            </p>
          </div>
        : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((lang, index) => {
              const languageName = lang.language || "Unknown";
              const icon = getLanguageIcon(languageName);
              const colorGradient = getLanguageColor(languageName);
              const repoCount = lang.total_repositories || 0;
              const bytes = lang.total_bytes || 0;
              const sizeInMB = (bytes / 1024 / 1024).toFixed(1);

              const progressPercentage = Math.min(
                (repoCount / maxRepos) * 100,
                100,
              );

              return (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                  <div className="flex flex-col items-center text-center">
                    {/* Icon with subtle gradient background */}
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <div className="text-3xl">{icon}</div>
                    </div>

                    {/* Language Name */}
                    <h3 className="text-white font-semibold text-lg mb-1 truncate w-full">
                      {languageName}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <FaCodeBranch className="w-3 h-3" />
                        {repoCount} {repoCount === 1 ? "repo" : "repos"}
                      </span>
                      <span className="text-white/20">•</span>
                      <span>{sizeInMB} MB</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full mt-3 bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${colorGradient.replace("/20", "")} h-1.5 rounded-full transition-all duration-700`}
                        style={{
                          width: `${progressPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }

        {/* Footer */}
        <div className="mt-8 text-center text-white/20 text-sm">
          Languages detected from your GitHub repositories
        </div>
      </div>
    </DashboardLayout>
  );
};
