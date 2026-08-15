import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { FaChartBar, FaUsers, FaStar } from "react-icons/fa";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-darkest">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-2xl mb-6">
            <img
              src="/stats_updater_logo_teal.svg"
              alt="GitStats"
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-primary">Git</span>
            <span className="text-white">Stats</span>
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Monitor your GitHub activity, followers, repositories, and more in
            one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ?
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary">
                  Go to Dashboard
                </Button>
              </Link>
            : <Link to="/login">
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-primary">
                  Get Started
                </Button>
              </Link>
            }
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mb-4">
              <FaChartBar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-white/60">
              Track your repository metrics and contribution trends.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-lg mb-4">
              <FaUsers className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
            <p className="text-white/60">
              Monitor your followers and network growth.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light/20 rounded-lg mb-4">
              <FaStar className="w-6 h-6 text-primary-light" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Achievements
            </h3>
            <p className="text-white/60">
              Celebrate your milestones and contributions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
