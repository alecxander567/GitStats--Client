import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GitHubCallback } from "./pages/GitHubCallback";
import { RepositoriesPage } from "./pages/RepositoriesPage";
import { LanguageSummaryPage } from "./pages/LanguageSummaryPage";
import { AnalyticsDashboardPage } from "./pages/AnalyticsDashboardPage";
import { ContributorsPage } from "./pages/ContributorsPage";
import { ProjectCategoriesPage } from "./pages/ProjectCategoriesPage";
import { RepositoryCategoriesPage } from "./pages/RepositoryCategoriesPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityDetailPage } from "./pages/CommunityDetailPage";
import { CommunityPostsPage } from "./pages/CommunityPostsPage";
import { ReadmeProfilePage } from "./pages/ReadmeProfilePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repositories"
              element={
                <ProtectedRoute>
                  <RepositoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/languages"
              element={
                <ProtectedRoute>
                  <LanguageSummaryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contributors"
              element={
                <ProtectedRoute>
                  <ContributorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-categories"
              element={
                <ProtectedRoute>
                  <ProjectCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repository/:repositoryId/categories"
              element={
                <ProtectedRoute>
                  <RepositoryCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <CommunitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:slug"
              element={
                <ProtectedRoute>
                  <CommunityDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:slug/posts"
              element={
                <ProtectedRoute>
                  <CommunityPostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/readme-profile"
              element={
                <ProtectedRoute>
                  <ReadmeProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
