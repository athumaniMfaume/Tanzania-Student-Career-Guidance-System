import { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Schools = () => {
  const { user } = useContext(AuthContext);

  const [schools, setSchools] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("O-Level");
  const [selectedCombinations, setSelectedCombinations] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch schools, combinations, programs
  const fetchData = async () => {
    try {
      const [schoolsRes, combRes, progRes] = await Promise.all([
        api.get("/schools"),
        api.get("/combinations"),
        api.get("/programs"),
      ]);
      setSchools(schoolsRes.data || []);
      setCombinations(combRes.data || []);
      setPrograms(progRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & pagination
  const filteredSchools = useMemo(
    () =>
      schools.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.location?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [schools, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / itemsPerPage));
  const currentData = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Modals
  const openModal = async (item) => {
    try {
      const res = await api.get(`/schools/${item._id}`);
      setModalItem(res.data);
    } catch {
      setModalItem(item);
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
  };

  const openFormModal = () => {
    setEditing(null);
    setName("");
    setLocation("");
    setLevel("O-Level");
    setSelectedCombinations([]);
    setSelectedPrograms([]);
    setError("");
    setFormModalOpen(true);
  };
  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditing(null);
    setName("");
    setLocation("");
    setLevel("O-Level");
    setSelectedCombinations([]);
    setSelectedPrograms([]);
    setError("");
  };

  // Submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setError("School name and location are required");
      return;
    }

    const payload = {
      name,
      location,
      level: level === "University" ? undefined : level,
      combinations: selectedCombinations,
      programs: selectedPrograms,
    };

    try {
      if (editing) {
        await api.put(`/schools/${editing._id}`, payload);
        showNotification("School updated successfully!");
      } else {
        await api.post("/schools", payload);
        showNotification("School added successfully!");
      }
      closeFormModal();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Action failed";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;
    try {
      await api.delete(`/schools/${id}`);
      showNotification("School deleted successfully!", "success");
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      showNotification(errorMsg, "error");
    }
  };

  // Edit
  const handleEdit = (school) => {
    setEditing(school);
    setName(school.name || "");
    setLocation(school.location || "");
    setLevel(school.isUniversity ? "University" : school.level || "O-Level");
    setSelectedCombinations(school.combinations?.map((c) => c._id) || []);
    setSelectedPrograms(school.programs?.map((p) => p._id) || []);
    setFormModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white z-40 animate-fade-in ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.type === "success" ? "✓" : "✕"} {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-500">Manage educational institutions and their programs</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search schools..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {user?.role === "admin" && (
            <button
              onClick={openFormModal}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg hover:from-primary-dark hover:to-primary transition font-medium shadow-sm"
            >
              + Add New School
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-primary to-primary-dark text-white">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">School Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Level</th>
                <th className="p-4">Combinations / Programs</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((school, index) => (
                  <tr key={school._id} className="hover:bg-blue-50">
                    <td className="p-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{school.name}</td>
                    <td className="p-4 text-gray-700">📍 {school.location}</td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {school.isUniversity ? "University" : school.level}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="flex gap-2 flex-wrap">
                        {(school.combinations?.length > 0 ? school.combinations : school.programs || []).map(
                          (item) => (
                            <span
                              key={item._id}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 transition"
                            >
                              {item.name}
                            </span>
                          )
                        )}
                        {(!school.combinations?.length && !school.programs?.length) && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => openModal(school)}
                        className="bg-blue-50 hover:bg-blue-100 text-primary px-3 py-2 rounded font-medium text-xs transition"
                      >
                        👁️ View
                      </button>
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(school)}
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(school._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No schools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Page <span className="text-primary font-bold">{currentPage}</span> of{" "}
          <span className="text-primary font-bold">{totalPages}</span>
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          Next →
        </button>
      </div>

      {/* View Modal */}
      {modalOpen && modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{modalItem.name}</h2>
                <p className="text-blue-100 text-sm mt-1">School Details</p>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-100 hover:text-white text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">📍 Location</h3>
                  <p className="text-gray-700 font-medium mt-1">{modalItem.location}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">🎓 Level</h3>
                  <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                    {modalItem.isUniversity ? "University" : modalItem.level}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">🔗 Combinations / Programs</h3>
                <div className="flex flex-wrap gap-2">
                  {(modalItem.combinations?.length > 0 ? modalItem.combinations : modalItem.programs || []).map((item) => (
                    <span
                      key={item._id}
                      className="inline-block px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200 transition"
                    >
                      ✓ {item.name}
                    </span>
                  ))}
                  {!modalItem.combinations?.length && !modalItem.programs?.length && (
                    <p className="text-gray-400 italic py-4 w-full text-center bg-gray-50 rounded-lg">No programs or combinations</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:from-primary-dark hover:to-primary transition shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <h2 className="text-2xl font-bold">{editing ? "Edit School" : "Add New School"}</h2>
              <p className="text-blue-100 text-sm mt-1">{editing ? "Update school information" : "Create a new school"}</p>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="School Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition"
                  required
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition"
                  required
                />
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition"
                >
                  <option value="O-Level">O-Level</option>
                  <option value="A-Level">A-Level</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                </select>

                {level === "A-Level" && (
                  <select
                    multiple
                    value={selectedCombinations}
                    onChange={(e) => setSelectedCombinations(Array.from(e.target.selectedOptions, o => o.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition"
                  >
                    {combinations.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                )}

                {(level === "College" || level === "University") && (
                  <select
                    multiple
                    value={selectedPrograms}
                    onChange={(e) => setSelectedPrograms(Array.from(e.target.selectedOptions, o => o.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition"
                  >
                    {programs.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={closeFormModal} className="px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:from-primary-dark hover:to-primary transition shadow-md">
                    {editing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schools;
