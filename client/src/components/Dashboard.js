import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const getUserData = useCallback(async function () {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No Authentication token found");
      }
      const response = await fetch("http://localhost:5000/auth/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Error details:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Failed to get details"
        );
      }
      const data = await response.json();

      console.log("Received user data:", data);
      setUser({ name: data.user.user_name, email: data.user.user_email });
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.message);
      //redirect to login if user is unauthorized
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("token")
      )
        handleLogout();
    } finally {
      setLoading(false);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) return <div className=" w-75">Loading dashboard...</div>;
  if (error) return <div className=" w-75 text-danger">Error: {error}</div>;
  return (
    <>
      <div
        id="dashboard"
        className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-indigo-600">
              Welcome back to your account
            </p>
          </div>

          {user && (
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 transition-all hover:shadow-2xl">
              <div className="space-y-4">
                <h5 className="text-2xl font-semibold text-indigo-800">
                  User Profile
                </h5>
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-medium text-indigo-700">Name:</span>{" "}
                    {user.name}
                  </p>
                  <p className="text-lg">
                    <span className="font-medium text-indigo-700">Email:</span>{" "}
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg text-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
