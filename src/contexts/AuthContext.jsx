import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  auth,
  signOut,
  signInWithGithub,
  getGithubCredential,
} from "../utils/firebase";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const githubToken = localStorage.getItem("github_token");
          const response = await api.post("/users/auth/firebase/", {
            idToken,
            github_token: githubToken,
          });
          const { user: userData, token: authToken } = response.data;
          setUser(userData);
          setToken(authToken);
          localStorage.setItem("token", authToken);
          localStorage.setItem("user", JSON.stringify(userData));
          if (userData?.github_token) {
            localStorage.setItem("github_token", userData.github_token);
          }
        } catch (error) {
          console.error("Auth error:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Firebase handles the whole GitHub OAuth dance internally.
  const loginWithGithub = useCallback(async () => {
    try {
      const result = await signInWithGithub();
      const credential = getGithubCredential(result);
      const githubToken = credential?.accessToken; // GitHub token, straight from Firebase

      if (githubToken) {
        localStorage.setItem("github_token", githubToken);
      }

      const idToken = await result.user.getIdToken();

      const backendResponse = await api.post("/users/auth/firebase/", {
        idToken,
        github_token: githubToken,
      });

      const { user: userData, token: authToken } = backendResponse.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      // Known benign Firebase popup/IndexedDB race — onAuthStateChanged
      // still completes the login independently, so don't surface this as a failure.
      if (error.message?.includes("Database is closing")) {
        console.warn("Ignoring benign Firebase IndexedDB race:", error.message);
        return { success: true };
      }
      console.error("GitHub login error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // "Sync repos" — re-validates the stored GitHub token and refreshes
  // profile stats (followers/repos/bio) from the GitHub API.
  const syncGithub = useCallback(async () => {
    const githubToken = localStorage.getItem("github_token");
    if (!githubToken) {
      return {
        success: false,
        error: "No GitHub token on file. Please log in again.",
      };
    }
    try {
      const response = await api.post(
        "/users/auth/github/add-token/",
        { github_token: githubToken },
        { headers: { Authorization: `Token ${token}` } },
      );
      setUser((prev) => ({ ...prev, ...response.data }));
      return { success: true };
    } catch (error) {
      console.error("Sync error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }, [token]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      if (token) {
        await api.post(
          "/users/auth/logout/",
          {},
          { headers: { Authorization: `Token ${token}` } },
        );
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("github_token");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    loginWithGithub,
    syncGithub,
    logout,
    isAuthenticated: !!user && !!token,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
