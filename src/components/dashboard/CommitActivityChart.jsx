// components/dashboard/CommitActivityChart.jsx - FULL FILE
import React, { useEffect, useState, useRef, useMemo } from "react";
import { FaChartLine, FaSync } from "react-icons/fa";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { api } from "../../services/api";

const WEEKS_TO_SHOW = 12;
const CONCURRENT_LIMIT = 5;

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

async function processInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export const CommitActivityChart = ({ repositories, username, loading }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  // Tracks whether we've successfully rendered the chart at least once.
  // Once true, we never fall back to the full blocking spinner again —
  // that's what was causing the chart to appear to "reload" every time
  // the parent's `loading` prop flickered (e.g. during a background sync).
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const fetchedRef = useRef(false);
  const previousRepoIdsRef = useRef("");

  const currentRepoIds = useMemo(() => {
    if (!repositories || !repositories.length) return "";
    return repositories
      .map((r) => r.id)
      .sort()
      .join(",");
  }, [repositories]);

  useEffect(() => {
    // Skip if no repositories
    if (!repositories || !repositories.length) {
      setWeeklyData([]);
      setIsFetching(false);
      return;
    }

    // Skip if already fetched with same repos
    if (fetchedRef.current && previousRepoIdsRef.current === currentRepoIds) {
      setIsFetching(false);
      return;
    }

    const fetchUserCommits = async () => {
      setIsFetching(true);

      try {
        const results = await processInBatches(
          repositories,
          CONCURRENT_LIMIT,
          async (repo) => {
            try {
              const response = await api.get(
                `/repositories/${repo.id}/user-commits/`,
              );
              return response.data;
            } catch (error) {
              return { commits: [] };
            }
          },
        );

        const allCommits = results.flatMap((result) => result.commits || []);

        if (allCommits.length === 0) {
          setWeeklyData([]);
          fetchedRef.current = true;
          previousRepoIdsRef.current = currentRepoIds;
          setIsFetching(false);
          setHasLoadedOnce(true);
          return;
        }

        const now = new Date();
        const buckets = [];
        for (let i = WEEKS_TO_SHOW - 1; i >= 0; i--) {
          const weekStart = getWeekStart(now);
          weekStart.setDate(weekStart.getDate() - i * 7);
          buckets.push({ weekStart, count: 0 });
        }

        allCommits.forEach((commit) => {
          if (!commit.date) return;
          const weekStart = getWeekStart(commit.date);
          const bucket = buckets.find(
            (b) => b.weekStart.getTime() === weekStart.getTime(),
          );
          if (bucket) bucket.count += 1;
        });

        setWeeklyData(
          buckets.map((b) => ({
            label: formatWeekLabel(b.weekStart),
            count: b.count,
          })),
        );
        fetchedRef.current = true;
        previousRepoIdsRef.current = currentRepoIds;
      } catch (error) {
        console.error("Error fetching user commits:", error);
        setWeeklyData([]);
      } finally {
        setIsFetching(false);
        setHasLoadedOnce(true);
      }
    };

    fetchUserCommits();
  }, [currentRepoIds, username]); // repositories intentionally excluded — currentRepoIds already captures identity

  // Only show the full blocking spinner on the very first load.
  // After that, keep whatever's already rendered instead of tearing it
  // down every time the parent's `loading` prop (reposLoading) toggles.
  const showBlockingSpinner = !hasLoadedOnce && (loading || isFetching);
  // Subtle indicator for background refreshes once we've already got data.
  const isRefreshing = hasLoadedOnce && (loading || isFetching);

  if (showBlockingSpinner) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 flex items-center justify-center h-64">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const hasData = weeklyData.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <FaChartLine className="text-secondary" />
          Commit Activity
          {isRefreshing && (
            <FaSync className="animate-spin text-white/30 text-xs ml-1" />
          )}
        </h3>
        <div className="text-white/40 text-center py-12">
          <p className="text-sm">No recent commits found</p>
          <p className="text-xs mt-1">
            We couldn't find any commits from you in the last 12 weeks
          </p>
        </div>
      </div>
    );
  }

  const width = 700;
  const height = 220;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 32;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxCount = Math.max(...weeklyData.map((d) => d.count), 1);
  const stepX = chartWidth / (weeklyData.length - 1 || 1);

  const points = weeklyData.map((d, i) => {
    const x = paddingLeft + i * stepX;
    const y = paddingTop + chartHeight - (d.count / maxCount) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} ` +
    `L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const peakWeek = weeklyData.reduce(
    (max, d) => (d.count > max.count ? d : max),
    weeklyData[0],
  );

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FaChartLine className="text-secondary" />
          Commit Activity
          {isRefreshing && (
            <FaSync className="animate-spin text-white/30 text-xs" />
          )}
        </h3>
        <p className="text-white/40 text-xs md:text-sm">
          Most active week: {peakWeek.label} ({peakWeek.count} commits)
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="commitAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((frac) => (
          <line
            key={frac}
            x1={paddingLeft}
            x2={width - paddingRight}
            y1={paddingTop + chartHeight * (1 - frac)}
            y2={paddingTop + chartHeight * (1 - frac)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#commitAreaFill)" />

        <path
          d={linePath}
          fill="none"
          stroke="#6C63FF"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.count > 0 ? 4 : 2.5}
            fill={
              p.count === peakWeek.count && p.count > 0 ? "#FFD166" : "#6C63FF"
            }
            stroke="#0f0f1a"
            strokeWidth="1.5">
            <title>{`${p.label}: ${p.count} commits`}</title>
          </circle>
        ))}

        {points.map((p, i) =>
          i % 2 === 0 ?
            <text
              key={`label-${i}`}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.4)">
              {p.label}
            </text>
          : null,
        )}

        <text
          x={paddingLeft - 8}
          y={paddingTop + 4}
          textAnchor="end"
          fontSize="10"
          fill="rgba(255,255,255,0.4)">
          {maxCount}
        </text>
        <text
          x={paddingLeft - 8}
          y={paddingTop + chartHeight}
          textAnchor="end"
          fontSize="10"
          fill="rgba(255,255,255,0.4)">
          0
        </text>
      </svg>
    </div>
  );
};
