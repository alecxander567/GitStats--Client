// components/repositories/RepositoryCard.jsx
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaCodeBranch,
  FaEye,
  FaExclamationCircle,
  FaLock,
  FaGlobe,
  FaArchive,
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
  FaHistory,
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
import LanguageProgressBar from "./LanguageProgressBar";
import { useLanguages } from "../../hooks/useLanguages";
import { repositoryService } from "../../services/repositoryService";

export const RepositoryCard = ({ repository }) => {
  const {
    id,
    name,
    full_name,
    description,
    visibility,
    primary_language,
    stars,
    forks,
    watchers,
    open_issues,
    archived,
    updated_at_github,
  } = repository;

  // Fetch languages for this repository
  const { languages, loading: languagesLoading } = useLanguages(id);

  // Calculate total bytes from languages
  const totalBytes = languages.reduce(
    (sum, lang) => sum + (lang.bytes || 0),
    0,
  );

  // Fetch the signed-in user's recent commits for this repository.
  // Mirrors the useLanguages pattern above — per-card fetch on mount,
  // keyed off repo id. Backed by the same recent_commits data captured
  // during sync (see analytics.Contributor / useGithubSync) and served
  // by /repositories/{id}/user-commits/.
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCommits = async () => {
      setCommitsLoading(true);
      try {
        const data = await repositoryService.getUserCommits(id);
        if (!cancelled) {
          setCommits(data?.commits || []);
        }
      } catch (err) {
        if (!cancelled) {
          setCommits([]);
        }
      } finally {
        if (!cancelled) {
          setCommitsLoading(false);
        }
      }
    };

    fetchCommits();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Commits come back newest-first from the backend.
  const lastCommit = commits[0] || null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getLanguageIcon = (language) => {
    if (!language)
      return <FaCode className="text-white/40 w-3 h-3 md:w-4 md:h-4" />;

    const lang = language.toLowerCase();

    // Check for specific matches first
    if (lang === "c#" || lang === "csharp") {
      return <span className="text-purple-400 font-bold text-sm">C#</span>;
    }
    if (lang === "c++" || lang === "cpp") {
      return <span className="text-blue-500 font-bold text-sm">C++</span>;
    }
    if (lang === "c") {
      return <FaCuttlefish className="text-blue-400" />;
    }

    const icons = {
      python: <FaPython className="text-blue-400" />,
      javascript: <FaJs className="text-yellow-400" />,
      typescript: <SiTypescript className="text-blue-500" />,
      react: <FaReact className="text-cyan-400" />,
      vue: <FaVuejs className="text-green-400" />,
      angular: <FaAngular className="text-red-400" />,
      java: <FaJava className="text-red-500" />,
      php: <FaPhp className="text-purple-400" />,
      ruby: <FaGem className="text-red-400" />,
      go: <SiGo className="text-cyan-400" />,
      rust: <FaRust className="text-orange-400" />,
      swift: <FaSwift className="text-orange-500" />,
      kotlin: <SiKotlin className="text-purple-500" />,
      html: <FaHtml5 className="text-orange-500" />,
      css: <FaCss3Alt className="text-blue-400" />,
      dockerfile: <FaDocker className="text-blue-400" />,
      shell: <FaTerminal className="text-green-400" />,
      bash: <FaTerminal className="text-green-400" />,
      scala: <SiScala className="text-red-500" />,
      perl: <SiPerl className="text-blue-400" />,
      lua: <SiLua className="text-blue-500" />,
      elixir: <SiElixir className="text-purple-500" />,
      clojure: <SiClojure className="text-blue-500" />,
      haskell: <SiHaskell className="text-purple-500" />,
      julia: <SiJulia className="text-purple-500" />,
      r: <SiR className="text-blue-400" />,
      dart: <SiDart className="text-blue-500" />,
      flutter: <SiFlutter className="text-blue-400" />,
      solidity: <SiSolidity className="text-gray-400" />,
      graphql: <SiGraphql className="text-pink-400" />,
    };

    for (const [key, icon] of Object.entries(icons)) {
      if (lang.includes(key)) {
        return icon;
      }
    }

    return <FaCode className="text-white/40 w-3 h-3 md:w-4 md:h-4" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 md:mb-3 gap-2">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">
              {getLanguageIcon(primary_language)}
            </span>
            <h3 className="text-base md:text-lg font-semibold text-white truncate">
              {name}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-white/40 truncate">
            {full_name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {archived && (
            <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 bg-yellow-500/20 text-yellow-500 text-[10px] md:text-xs rounded-full">
              <FaArchive className="w-2 h-2 md:w-3 md:h-3" />
              <span className="hidden xs:inline">Archived</span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded-full ${
              visibility === "public" ?
                "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
            }`}>
            {visibility === "private" ?
              <FaLock className="w-2 h-2 md:w-3 md:h-3" />
            : <FaGlobe className="w-2 h-2 md:w-3 md:h-3" />}
            <span className="hidden xs:inline">{visibility}</span>
          </span>
        </div>
      </div>

      {description && (
        <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
        <span className="flex items-center gap-1 text-xs md:text-sm text-white/60">
          {primary_language || "No language"}
        </span>
        <span className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-white/60">
          <FaStar className="text-yellow-400 w-3 h-3 md:w-4 md:h-4" />
          {stars}
        </span>
        <span className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-white/60">
          <FaCodeBranch className="text-blue-400 w-3 h-3 md:w-4 md:h-4" />
          {forks}
        </span>
        <span className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-white/60">
          <FaEye className="text-green-400 w-3 h-3 md:w-4 md:h-4" />
          {watchers}
        </span>
        {open_issues > 0 && (
          <span className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-red-400">
            <FaExclamationCircle className="w-3 h-3 md:w-4 md:h-4" />
            {open_issues}
          </span>
        )}
      </div>

      {/* Language Progress Bar Section */}
      <div className="mb-3 md:mb-4">
        {languagesLoading ?
          <div className="flex items-center gap-2 text-white/40">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span className="text-xs">Loading languages...</span>
          </div>
        : <LanguageProgressBar languages={languages} totalBytes={totalBytes} />}
      </div>

      {/* Recent Commit Section */}
      <div className="mb-3 md:mb-4 pt-3 md:pt-4 border-t border-white/10">
        {commitsLoading ?
          <div className="flex items-center gap-2 text-white/40">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span className="text-xs">Loading commits...</span>
          </div>
        : lastCommit ?
          <div className="flex items-start gap-2">
            <FaHistory className="text-secondary w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-white/80 truncate">
                {(lastCommit.message || "").split("\n")[0]}
              </p>
              <p className="text-[10px] md:text-xs text-white/40">
                Last commit {formatDate(lastCommit.date)}
                {commits.length > 1 && ` · ${commits.length} recent commits`}
              </p>
            </div>
          </div>
        : <p className="text-[10px] md:text-xs text-white/40">
            No recent commits from you
          </p>
        }
      </div>

      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10">
        <span className="text-[10px] md:text-xs text-white/40">
          Updated {formatDate(updated_at_github)}
        </span>
        {languages.length > 0 && !languagesLoading && (
          <span className="text-[10px] md:text-xs text-white/30">
            {languages.length} language{languages.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};
