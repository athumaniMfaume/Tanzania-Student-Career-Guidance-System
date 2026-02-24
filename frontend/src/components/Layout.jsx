import React, { useState, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "📚", label: "Subjects", path: "/subjects" },
    { icon: "🔗", label: "Combinations", path: "/combinations" },
    { icon: "🎓", label: "Programs", path: "/programs" },
    { icon: "🏫", label: "Schools", path: "/schools" },
    { icon: "💼", label: "Jobs", path: "/jobs" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 p-0 flex flex-col fixed md:static h-full transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="bg-blue-800 px-6 py-8 border-b border-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A4.5 4.5 0 0116 13H4a2 2 0 00-2-2h-.5a1 1 0 110-2H2a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Career Guide</h1>
              <p className="text-xs text-blue-200">Your Success Path</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200 text-blue-50"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Auth Section */}
        <div className="border-t border-blue-600 px-4 py-6 space-y-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition font-medium"
              >
                <span>🔓</span> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <span>✍️</span> Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
            >
              <span>🚪</span> Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-blue-600 hover:bg-gray-100 p-2 rounded-lg transition"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tanzania Career Guidance System</h2>
                <p className="text-xs text-gray-500">Empowering careers, shaping futures</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.[0] || user.username?.[0] || "U"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white border-t border-blue-800">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-blue-100 text-sm space-y-2">
            <p>&copy; 2026 Tanzania Career Guidance System. All rights reserved. | Empowering Students. Shaping Futures.</p>
            <p className="text-xs text-blue-200">Developed by <a href="https://athumanimfaume.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-blue-200 transition duration-200 underline">Athumani Mfaume</a></p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;