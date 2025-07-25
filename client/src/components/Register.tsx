import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegisterProps {
  setAuth?: (authState: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({
  setAuth = () => console.log("fallback setAuth used"),
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { name, email, password } = inputs;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    //clear errors when user types
    if (error) setError(null);
  };

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      //store token and update auth state
      localStorage.setItem("token", data.token);
      setSuccess(true);

      //verify setAuth exists before calling it
      if (typeof setAuth === "function") {
        setAuth(true);
      } else {
        console.error("setAuth is not a function - current value:", setAuth);
      }
      //redirect after successful registration
      window.location.href = "/login";
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-indigo-700 py-10 px-12">
            <h1 className="text-center text-5xl font-bold text-white">
              Create Account
            </h1>
          </div>

          <div className="p-10">
            {error && (
              <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-xl">
                <p className="font-bold text-2xl">Error</p>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded text-xl">
                <p className="font-bold text-2xl">Success!</p>
                <p>Registration Successful. You can now log in</p>
              </div>
            )}

            <form onSubmit={onSubmitForm} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-2xl font-medium text-gray-700 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-6 py-5 text-2xl rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  value={name}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-2xl font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-6 py-5 text-2xl rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  placeholder="example@email.com"
                  value={email}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-2xl font-medium text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="w-full px-6 py-5 text-2xl rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all pr-16"
                  value={password}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className="absolute bottom-5 right-5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg
                      className="h-8 w-8 text-gray-400 hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-8 w-8 text-gray-400 hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-2xl transition-all duration-200 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-7 w-7 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>{" "}
                    Processing...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xl text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
