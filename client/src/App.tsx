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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuth = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  async function isAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok && data.isVerified) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    isAuth();
  }, []);
  if (loading) {
    return <div className="container">Checking authentication...</div>;
  }

  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            {/* protecting dashboard  */}
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
    </>
  );
}

export default App;