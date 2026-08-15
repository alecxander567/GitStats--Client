import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { Alert } from "../components/common/Alert";
import { FaGithub } from "react-icons/fa";

export const SignupPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGitHubSignup = async () => {
    setLoading(true);
    setError("");

    const result = await login();

    if (result.success) {
      window.location.href = "/dashboard";
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-darkest p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
              <FaGithub className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-white/60 mt-2">
              Start tracking your GitHub stats
            </p>
          </div>

          <Alert type="error" message={error} onClose={() => setError("")} />

          <Button
            onClick={handleGitHubSignup}
            loading={loading}
            disabled={loading}
            fullWidth
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary">
            <FaGithub className="w-5 h-5" />
            {loading ? "Signing up..." : "Sign up with GitHub"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark/50 text-white/60">or</span>
            </div>
          </div>

          <p className="text-center text-white/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-light hover:text-primary font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
