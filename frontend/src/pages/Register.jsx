import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Get Started</h1>
            <p className="text-blue-100 text-sm">Create an account to explore career opportunities</p>
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

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                  <span>✓</span> {success}
                </p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>


            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>✍️</span>
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;