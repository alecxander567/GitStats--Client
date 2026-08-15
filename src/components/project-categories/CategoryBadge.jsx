import React from "react";
import {
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaBrain,
  FaPlug,
  FaTerminal,
  FaMicrochip,
  FaGamepad,
  FaBook,
  FaQuestion,
} from "react-icons/fa";

const categoryIcons = {
  Web: <FaGlobe />,
  Mobile: <FaMobile />,
  Desktop: <FaDesktop />,
  AI: <FaBrain />,
  API: <FaPlug />,
  CLI: <FaTerminal />,
  IoT: <FaMicrochip />,
  Game: <FaGamepad />,
  Library: <FaBook />,
  Other: <FaQuestion />,
};

const categoryColors = {
  Web: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mobile: "bg-green-500/20 text-green-400 border-green-500/30",
  Desktop: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  AI: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  API: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CLI: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  IoT: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Game: "bg-red-500/20 text-red-400 border-red-500/30",
  Library: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Other: "bg-white/10 text-white/60 border-white/20",
};

const getConfidenceColor = (confidence) => {
  if (confidence >= 70) return "text-green-400";
  if (confidence >= 50) return "text-yellow-400";
  return "text-orange-400";
};

export const CategoryBadge = ({
  category,
  confidence,
  size = "md",
  showConfidence = true,
}) => {
  const Icon = categoryIcons[category] || categoryIcons.Other;
  const colorClass = categoryColors[category] || categoryColors.Other;
  const confidenceColor = getConfidenceColor(confidence);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClasses[size]}`}>
      <span className="text-current">{Icon}</span>
      <span>{category}</span>
      {showConfidence && confidence !== undefined && (
        <span className={`text-xs ml-0.5 ${confidenceColor}`}>
          {confidence}%
        </span>
      )}
    </span>
  );
};
