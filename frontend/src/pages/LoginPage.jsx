import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GoogleAuthProvider } from "firebase/auth";

// Google Icon Only
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.386-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.442-3.307C18.254 1.446 15.568 0 12.24 0 5.491 0 0 5.491 0 12s5.491 12 12.24 12c6.957 0 11.518-4.818 11.518-11.756 0-.79-.07-1.579-.199-2.348H12.24z"
    ></path>
  </svg>
);

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }
    login(formData, null);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      login(null, provider);
    } catch (error) {
      console.error("Google login error:", error.message);
      alert("Google login failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdf6f7] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Please login to your account</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button className="flex-1 py-2 px-4 text-center text-sm font-medium text-[#dc3545] border-b-2 border-[#dc3545]">
            Login
          </button>
          <Link
            to="/signup"
            className="flex-1 py-2 px-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Sign Up
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <a className="text-sm text-red-600 hover:text-red-500">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md text-white ${
                isLoggingIn
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-[#dc3545] hover:bg-[#c82333]"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* GOOGLE ONLY */}
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:ring-2 focus:ring-red-500"
              >
                <GoogleIcon />
                Google
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-red-600 hover:text-red-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
