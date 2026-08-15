import React from "react";
import {
  FaCode,
  FaStar,
  FaCodeBranch,
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

export const RepositoryStats = ({ stats, loading }) => {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-4 md:p-6 border border-white/10 animate-pulse">
            <div className="h-3 md:h-4 bg-white/20 rounded w-1/2 mb-2"></div>
            <div className="h-6 md:h-8 bg-white/20 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Languages */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
        <h4 className="text-xs md:text-sm font-semibold text-white/60 mb-2 md:mb-3">
          Top Languages
        </h4>
        {stats.languages && Object.keys(stats.languages).length > 0 ?
          <div className="space-y-2">
            {Object.entries(stats.languages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([language, count]) => (
                <div
                  key={language}
                  className="flex justify-between items-center p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-all">
                  <span className="text-white/60 flex items-center gap-2 text-sm">
                    {getLanguageIcon(language)}
                    {language}
                  </span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
          </div>
        : <p className="text-white/40 text-xs md:text-sm">
            No languages detected
          </p>
        }
      </div>
    </div>
  );
};
