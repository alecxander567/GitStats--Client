// components/repositories/LanguageProgressBar.jsx
import React from "react";
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

const LanguageProgressBar = ({ languages, totalBytes }) => {
  // Check if languages is valid
  if (!languages || !Array.isArray(languages) || languages.length === 0) {
    return <div className="text-xs text-white/40">No languages detected</div>;
  }

  // Filter out languages that don't have a 'language' field or have undefined values
  const validLanguages = languages.filter((lang) => lang && lang.language);

  if (validLanguages.length === 0) {
    return <div className="text-xs text-white/40">No valid language data</div>;
  }

  // Sort languages by percentage descending
  const sortedLanguages = [...validLanguages].sort((a, b) => {
    const aPercent = parseFloat(a.percentage) || 0;
    const bPercent = parseFloat(b.percentage) || 0;
    return bPercent - aPercent;
  });

  // Limit to top 5 languages for display
  const topLanguages = sortedLanguages.slice(0, 5);
  const otherLanguages = sortedLanguages.slice(5);
  const otherPercentage = otherLanguages.reduce(
    (sum, lang) => sum + (parseFloat(lang.percentage) || 0),
    0,
  );

  const getLanguageColor = (language) => {
    if (!language) return "bg-gray-500";

    const lang = language.toLowerCase();
    const colors = {
      python: "bg-blue-400",
      javascript: "bg-yellow-400",
      typescript: "bg-blue-500",
      react: "bg-cyan-400",
      vue: "bg-green-400",
      angular: "bg-red-400",
      java: "bg-red-500",
      php: "bg-purple-400",
      ruby: "bg-red-400",
      go: "bg-cyan-400",
      rust: "bg-orange-400",
      swift: "bg-orange-500",
      kotlin: "bg-purple-500",
      html: "bg-orange-500",
      css: "bg-blue-400",
      dockerfile: "bg-blue-400",
      shell: "bg-green-400",
      bash: "bg-green-400",
      scala: "bg-red-500",
      perl: "bg-blue-400",
      lua: "bg-blue-500",
      elixir: "bg-purple-500",
      clojure: "bg-blue-500",
      haskell: "bg-purple-500",
      julia: "bg-purple-500",
      r: "bg-blue-400",
      dart: "bg-blue-500",
      flutter: "bg-blue-400",
      solidity: "bg-gray-400",
      graphql: "bg-pink-400",
      c: "bg-blue-400",
      "c#": "bg-purple-400",
      "c++": "bg-blue-500",
    };

    for (const [key, color] of Object.entries(colors)) {
      if (lang.includes(key)) {
        return color;
      }
    }
    return "bg-gray-500";
  };

  const getLanguageIcon = (language) => {
    if (!language) return <FaCode className="w-3 h-3" />;

    const lang = language.toLowerCase();

    if (lang === "c#" || lang === "csharp") {
      return <span className="text-purple-400 font-bold text-xs">C#</span>;
    }
    if (lang === "c++" || lang === "cpp") {
      return <span className="text-blue-500 font-bold text-xs">C++</span>;
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

    return <FaCode className="text-white/40 w-3 h-3" />;
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* Progress bar container */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/10">
        {topLanguages.map((lang, index) => {
          const percentage = parseFloat(lang.percentage) || 0;
          return (
            <div
              key={`${lang.language}-${index}`}
              className={`${getLanguageColor(lang.language)} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
              title={`${lang.language}: ${percentage}%`}
            />
          );
        })}
        {otherPercentage > 0 && (
          <div
            className="bg-gray-500 transition-all duration-500"
            style={{ width: `${otherPercentage}%` }}
            title={`Other: ${otherPercentage.toFixed(1)}%`}
          />
        )}
      </div>

      {/* Language labels */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {topLanguages.map((lang, index) => {
          const percentage = parseFloat(lang.percentage) || 0;
          return (
            <div
              key={`${lang.language}-${index}`}
              className="flex items-center gap-1">
              <span className="text-xs">{getLanguageIcon(lang.language)}</span>
              <span className="text-xs text-white/60">{lang.language}</span>
              <span className="text-xs text-white/40">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
        {otherPercentage > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/40">Other</span>
            <span className="text-xs text-white/40">
              {otherPercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Total bytes info */}
      {totalBytes > 0 && (
        <div className="text-[10px] text-white/30">
          Total: {formatBytes(totalBytes)}
        </div>
      )}
    </div>
  );
};

export default LanguageProgressBar;
