// services/githubService.js
import { api } from "./api";

export const githubService = {
  // Fetch repositories from GitHub API for the authenticated token owner
  fetchUserRepositories: async (token) => {
    try {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching from GitHub:", error);
      throw error;
    }
  },

  // Transform GitHub repo data to match your backend schema
  transformRepoData: (githubRepo) => ({
    github_repo_id: githubRepo.id,
    name: githubRepo.name,
    full_name: githubRepo.full_name,
    description: githubRepo.description || "",
    visibility: githubRepo.private ? "private" : "public",
    primary_language: githubRepo.language,
    default_branch: githubRepo.default_branch || "main",
    stars: githubRepo.stargazers_count || 0,
    forks: githubRepo.forks_count || 0,
    watchers: githubRepo.watchers_count || 0,
    open_issues: githubRepo.open_issues_count || 0,
    size: githubRepo.size || 0,
    license: githubRepo.license?.name || null,
    homepage: githubRepo.homepage || null,
    archived: githubRepo.archived || false,
    disabled: githubRepo.disabled || false,
    created_at_github: githubRepo.created_at,
    updated_at_github: githubRepo.updated_at,
    pushed_at: githubRepo.pushed_at,
  }),
};
