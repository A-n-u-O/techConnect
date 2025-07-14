import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuth = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  async function isAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const { user } = await response.json();
        setIsAuthenticated(true);
        return user;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    isAuth();
    
    // Optional: Set up periodic auth checks every 5 minutes
    const interval = setInterval(isAuth, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="container">Checking authentication...</div>;
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="/register" element={<Register setAuth={setAuth} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;