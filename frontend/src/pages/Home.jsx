import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [counts, setCounts] = useState({
    subjects: 0,
    schools: 0,
    programs: 0,
    jobs: 0,
    combinations: 0,
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    subjects: [],
    schools: [],
    programs: [],
    jobs: [],
    combinations: [],
  });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState("");

  const openModal = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
    setModalType("");
  };

  const fetchCounts = async () => {
    try {
      const [subjectsRes, schoolsRes, programsRes, jobsRes, combinationsRes] =
        await Promise.all([
          api.get("/subjects"),
          api.get("/schools"),
          api.get("/programs"),
          api.get("/jobs"),
          api.get("/combinations"),
        ]);

      setCounts({
        subjects: subjectsRes.data.length || 0,
        schools: schoolsRes.data.length || 0,
        programs: programsRes.data.length || 0,
        jobs: jobsRes.data.length || 0,
        combinations: combinationsRes.data.length || 0,
      });
    } catch (err) {
      console.log("Failed to fetch counts:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const handleSearch = async () => {
    if (!query || query.trim() === "") return;
    setLoadingSearch(true);
    try {
      const encoded = encodeURIComponent(query);
      const [subjectsRes, schoolsRes, programsRes, jobsRes, combinationsRes] = await Promise.all([
        api.get(`/subjects?q=${encoded}`),
        api.get(`/schools?q=${encoded}`),
        api.get(`/programs?q=${encoded}`),
        api.get(`/jobs?q=${encoded}`),
        api.get(`/combinations?q=${encoded}`),
      ]);

      setResults({
        subjects: subjectsRes.data || [],
        schools: schoolsRes.data || [],
        programs: programsRes.data || [],
        jobs: jobsRes.data || [],
        combinations: combinationsRes.data || [],
      });
      setModalItem(null);
      setModalType("searchResults");
      setModalOpen(true);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Prepare data for chart
  const chartData = [
    { name: "Subjects", count: counts.subjects },
    { name: "Schools", count: counts.schools },
    { name: "Programs", count: counts.programs },
    { name: "Jobs", count: counts.jobs },
    { name: "Combinations", count: counts.combinations },
  ];
  const displayName = user?.name || user?.username || user?.email || "User";

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Career Icon */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A4.5 4.5 0 0016 13H4a2 2 0 00-2-2h-.5a1 1 0 110-2H2a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Student Career Guidance</h1>
              <p className="text-blue-100 mt-1">Your pathway to career success</p>
            </div>
          </div>
          <p className="text-blue-100 mt-4">Welcome back, <span className="font-semibold text-white">{displayName}</span></p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="Search schools, programs, jobs, subjects, combinations..."
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loadingSearch}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition shadow-md"
              >
                {loadingSearch ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Subjects */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Subjects</p>
                  <p className="text-4xl font-bold text-blue-600">{counts.subjects}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804C9 4.393 9.448 4 10 4s1 .393 1 .804v15.192c0 .411-.448.804-1 .804s-1-.393-1-.804V4.804z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Schools */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Schools</p>
                  <p className="text-4xl font-bold text-green-600">{counts.schools}</p>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Programs</p>
                  <p className="text-4xl font-bold text-indigo-600">{counts.programs}</p>
                </div>
                <div className="bg-indigo-200 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Jobs */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Jobs</p>
                  <p className="text-4xl font-bold text-orange-600">{counts.jobs}</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A4.5 4.5 0 0016 13H4a2 2 0 00-2-2h-.5a1 1 0 110-2H2a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Combinations */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Combinations</p>
                  <p className="text-4xl font-bold text-pink-600">{counts.combinations}</p>
                </div>
                <div className="bg-pink-200 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-pink-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm2 4h6v2H6v-2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => [value, 'Count']}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{modalItem ? (modalItem.name || modalItem.title || modalType) : 'Search Results'}</h3>
              <div>
                {modalItem && (
                  <button onClick={() => { setModalItem(null); setModalType('searchResults'); }} className="mr-2 text-sm text-blue-600">Back</button>
                )}
                <button onClick={closeModal} className="text-gray-600 px-2">Close</button>
              </div>
            </div>

            <div>
              {modalItem ? (
                <div className="space-y-3">
                  {modalItem.description && <p className="text-sm text-gray-700">{modalItem.description}</p>}

                  {/* Specific formatted fields based on modalType */}
                  {modalType === 'programs' && (
                    <div>
                      <p className="font-medium">Combinations:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.combinations || []).map((c) => (
                          <li key={c._id || c}>{c.name || c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalType === 'schools' && (
                    <div>
                      <p><strong>Location:</strong> {modalItem.location || 'N/A'}</p>
                      <p><strong>Level:</strong> {modalItem.isUniversity ? 'University' : (modalItem.level || 'N/A')}</p>
                      <p className="font-medium">Programs:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.programs || []).map((p) => (
                          <li key={p._id || p}>{p.name || p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalType === 'subjects' && (
                    <div>
                      <p className="font-medium">Combinations:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.combinations || []).map((c) => (
                          <li key={c._id || c}>{c.name || c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalType === 'jobs' && (
                    <div>
                      <p className="font-medium">Related Programs:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.relatedPrograms || []).map((p) => (
                          <li key={p._id || p}>{p.name || p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalType === 'combinations' && (
                    <div>
                      <p className="font-medium">Subjects:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.subjects || []).map((s) => (
                          <li key={s._id || s}>{s.name || s}</li>
                        ))}
                      </ul>
                      <p className="font-medium mt-2">Programs:</p>
                      <ul className="list-disc list-inside">
                        {(modalItem.programs || []).map((p) => (
                          <li key={p._id || p}>{p.name || p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {['programs','schools','subjects','jobs','combinations'].map((key) => (
                    <div key={key}>
                      <h4 className="font-medium mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                      {results[key] && results[key].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {results[key].map((item) => (
                            <div key={item._id} className="p-3 border rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold">{item.name || item.title}</div>
                                  {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
                                </div>
                                <div>
                                  <button onClick={() => openModal(item, key)} className="bg-blue-600 text-white px-3 py-1 rounded">View</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">No {key} found</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;