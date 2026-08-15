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

export const getLanguageIcon = (language, size = "text-3xl") => {
  if (!language) return <FaCode className={`text-white/40 ${size}`} />;

  const lang = language.toLowerCase().trim();

  // Exact matches for special cases
  if (lang === "c#" || lang === "csharp") {
    return <span className={`text-purple-400 font-bold ${size}`}>C#</span>;
  }
  if (lang === "c++" || lang === "cpp") {
    return <span className={`text-blue-500 font-bold ${size}`}>C++</span>;
  }
  if (lang === "c") {
    return <FaCuttlefish className={`text-blue-400 ${size}`} />;
  }

  const exactMatchIcons = {
    python: <FaPython className={`text-blue-400 ${size}`} />,
    javascript: <FaJs className={`text-yellow-400 ${size}`} />,
    typescript: <SiTypescript className={`text-blue-500 ${size}`} />,
    react: <FaReact className={`text-cyan-400 ${size}`} />,
    vue: <FaVuejs className={`text-green-400 ${size}`} />,
    angular: <FaAngular className={`text-red-400 ${size}`} />,
    java: <FaJava className={`text-red-500 ${size}`} />,
    php: <FaPhp className={`text-purple-400 ${size}`} />,
    ruby: <FaGem className={`text-red-400 ${size}`} />,
    go: <SiGo className={`text-cyan-400 ${size}`} />,
    rust: <FaRust className={`text-orange-400 ${size}`} />,
    swift: <FaSwift className={`text-orange-500 ${size}`} />,
    kotlin: <SiKotlin className={`text-purple-500 ${size}`} />,
    html: <FaHtml5 className={`text-orange-500 ${size}`} />,
    css: <FaCss3Alt className={`text-blue-400 ${size}`} />,
    dockerfile: <FaDocker className={`text-blue-400 ${size}`} />,
    shell: <FaTerminal className={`text-green-400 ${size}`} />,
    bash: <FaTerminal className={`text-green-400 ${size}`} />,
    scala: <SiScala className={`text-red-500 ${size}`} />,
    perl: <SiPerl className={`text-blue-400 ${size}`} />,
    lua: <SiLua className={`text-blue-500 ${size}`} />,
    elixir: <SiElixir className={`text-purple-500 ${size}`} />,
    clojure: <SiClojure className={`text-blue-500 ${size}`} />,
    haskell: <SiHaskell className={`text-purple-500 ${size}`} />,
    julia: <SiJulia className={`text-purple-500 ${size}`} />,
    r: <SiR className={`text-blue-400 ${size}`} />,
    dart: <SiDart className={`text-blue-500 ${size}`} />,
    flutter: <SiFlutter className={`text-blue-400 ${size}`} />,
    solidity: <SiSolidity className={`text-gray-400 ${size}`} />,
    graphql: <SiGraphql className={`text-pink-400 ${size}`} />,
  };

  if (exactMatchIcons[lang]) {
    return exactMatchIcons[lang];
  }

  // Check partial matches (only if language name is longer than 2 chars)
  if (lang.length > 2) {
    for (const [key, icon] of Object.entries(exactMatchIcons)) {
      if (lang.includes(key)) {
        return icon;
      }
    }
  }

  return <FaCode className={`text-white/40 ${size}`} />;
};

export const getLanguageColor = (language) => {
  if (!language) return "from-gray-500/20 to-gray-600/20";

  const lang = language.toLowerCase().trim();

  const colors = {
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

  if (colors[lang]) {
    return colors[lang];
  }

  if (lang.length > 2) {
    for (const [key, color] of Object.entries(colors)) {
      if (lang.includes(key)) {
        return color;
      }
    }
  }

  return "from-primary/20 to-secondary/20";
};
