import { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Programs = () => {
  const { user } = useContext(AuthContext);

  const [programs, setPrograms] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [selectedCombinations, setSelectedCombinations] = useState([]);
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

  // Fetch programs & combinations
  const fetchData = async () => {
    try {
      const [progRes, combRes] = await Promise.all([
        api.get("/programs"),
        api.get("/combinations"),
      ]);
      setPrograms(progRes.data || []);
      setCombinations(combRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & pagination
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [programs, searchTerm]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage) || 1;
  const currentData = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Modals
  const openModal = async (item) => {
    try {
      const res = await api.get(`/programs/${item._id}`);
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
    setSelectedCombinations([]);
    setError("");
    setFormModalOpen(true);
  };
  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditing(null);
    setName("");
    setSelectedCombinations([]);
    setError("");
  };

  // Submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Program name is required");
    if (selectedCombinations.length === 0)
      return setError("Select at least one combination");

    const payload = { name, combinations: selectedCombinations };

    try {
      if (editing) {
        await api.put(`/programs/${editing._id}`, payload);
        showNotification("Program updated successfully!", "success");
      } else {
        await api.post("/programs", payload);
        showNotification("Program added successfully!", "success");
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
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await api.delete(`/programs/${id}`);
      showNotification("Program deleted successfully!", "success");
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      showNotification(errorMsg, "error");
    }
  };

  // Edit
  const handleEdit = (prog) => {
    setEditing(prog);
    setName(prog.name || "");
    setSelectedCombinations(prog.combinations?.map((c) => c._id) || []);
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
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-500">Manage educational and career programs</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search programs..."
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
              + Add New
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
                <th className="p-4">Program Name</th>
                <th className="p-4">Combinations</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((prog, index) => (
                  <tr key={prog._id} className="hover:bg-blue-50">
                    <td className="p-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-900">{prog.name}</td>
                    <td className="p-4 text-gray-700">
                      {prog.combinations?.length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                          {prog.combinations.map((c) => (
                            <span
                              key={c._id}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 transition"
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {/* View for all */}
                      <button
                        onClick={() => openModal(prog)}
                        className="bg-blue-50 hover:bg-blue-100 text-primary px-3 py-2 rounded font-medium text-xs transition"
                      >
                        👁️ View
                      </button>
                      {/* Edit/Delete only admin */}
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(prog)}
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(prog._id)}
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
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No programs found.
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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
                <p className="text-blue-100 text-sm mt-1">Program Details</p>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-100 hover:text-white text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {modalItem.combinations?.length > 0 ? (
                modalItem.combinations.map((c) => (
                  <div
                    key={c._id || c}
                    className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200 transition mr-2 mb-2"
                  >
                    ✓ {c.name || c}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
                  No combinations linked.
                </p>
              )}
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
              <h2 className="text-2xl font-bold">
                {editing ? "Edit Program" : "Add New Program"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {editing
                  ? "Update program information"
                  : "Create a new program"}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Program Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter program name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Related Combinations
                  </label>
                  <select
                    multiple
                    value={selectedCombinations}
                    onChange={(e) =>
                      setSelectedCombinations(
                        Array.from(e.target.selectedOptions, (o) => o.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    {combinations.map((comb) => (
                      <option key={comb._id} value={comb._id}>
                        {comb.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl (Cmd on Mac) to select multiple
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeFormModal}
                    className="px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:from-primary-dark hover:to-primary transition shadow-md"
                  >
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

export default Programs;