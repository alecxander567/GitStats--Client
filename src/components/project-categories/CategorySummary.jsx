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
  FaCheck,
} from "react-icons/fa";

const categoryConfig = {
  Web: {
    icon: FaGlobe,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBg: "hover:bg-blue-500/20",
  },
  Mobile: {
    icon: FaMobile,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverBg: "hover:bg-green-500/20",
  },
  Desktop: {
    icon: FaDesktop,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverBg: "hover:bg-purple-500/20",
  },
  AI: {
    icon: FaBrain,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    hoverBg: "hover:bg-pink-500/20",
  },
  API: {
    icon: FaPlug,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    hoverBg: "hover:bg-orange-500/20",
  },
  CLI: {
    icon: FaTerminal,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    hoverBg: "hover:bg-gray-500/20",
  },
  IoT: {
    icon: FaMicrochip,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    hoverBg: "hover:bg-cyan-500/20",
  },
  Game: {
    icon: FaGamepad,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    hoverBg: "hover:bg-red-500/20",
  },
  Library: {
    icon: FaBook,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    hoverBg: "hover:bg-yellow-500/20",
  },
  Other: {
    icon: FaQuestion,
    color: "text-white/40",
    bgColor: "bg-white/5",
    borderColor: "border-white/10",
    hoverBg: "hover:bg-white/10",
  },
};

export const CategorySummary = ({
  stats = [],
  loading = false,
  selectedCategory = null,
  onCategoryClick = null,
}) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/3"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        <p>No category statistics available</p>
      </div>
    );
  }

  const total = stats.reduce((sum, cat) => sum + cat.count, 0);
  const isClickable = typeof onCategoryClick === "function";

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">
            Category Distribution
          </h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {total} total
          </span>
          {isClickable && (
            <span className="text-xs text-white/40 ml-2">
              (Click to filter)
            </span>
          )}
        </div>
        <span className="text-white/40 text-sm">{stats.length} categories</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {stats.map((stat) => {
          const config = categoryConfig[stat.category] || categoryConfig.Other;
          const Icon = config.icon;
          const percentage = ((stat.count / total) * 100).toFixed(1);
          const isSelected = selectedCategory === stat.category;

          return (
            <div
              key={stat.category}
              onClick={() => isClickable && onCategoryClick(stat.category)}
              className={`p-4 rounded-xl border transition-all ${
                isSelected ?
                  `${config.borderColor} ${config.bgColor} ring-2 ring-primary/50 transform scale-[1.02]`
                : `${config.borderColor} ${config.bgColor}`
              } ${
                isClickable ?
                  `cursor-pointer ${config.hoverBg} hover:transform hover:scale-[1.02] hover:border-primary/50`
                : ""
              }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span className="text-white font-medium text-sm truncate">
                    {stat.category}
                  </span>
                </div>
                {isSelected && <FaCheck className="w-3 h-3 text-primary" />}
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-white">
                  {stat.count}
                </span>
                <span className="text-white/40 text-sm">{percentage}%</span>
              </div>
              <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${config.color.replace(
                    "text-",
                    "bg-",
                  )}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
