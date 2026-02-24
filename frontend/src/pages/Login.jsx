import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    return (
      <div className="flex items-center justify-center h-screen">
        AuthContext not available
      </div>
    );
  }

  const { login } = auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full opacity-10"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-blue-100 text-sm">Sign in to access your career guidance dashboard</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>🔓</span>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;