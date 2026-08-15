import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { Alert } from "../components/common/Alert";
import { FaGithub } from "react-icons/fa";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithGithub } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError("");
    const result = await loginWithGithub();
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-darkest p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <img
              src="/stats_updater_logo_teal.svg"
              alt="Stats Updater"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-white/60 mt-2">Sign in with GitHub</p>
          </div>
          <Alert type="error" message={error} onClose={() => setError("")} />
          <Button
            onClick={handleGitHubLogin}
            loading={loading}
            disabled={loading}
            fullWidth
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary">
            <FaGithub className="w-5 h-5" />
            {loading ? "Signing in..." : "Continue with GitHub"}
          </Button>
        </div>
      </div>
    </div>
  );
};
