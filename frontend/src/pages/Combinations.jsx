import { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Combinations = () => {
  const { user } = useContext(AuthContext);

  const [combinations, setCombinations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredCombinations = useMemo(() => {
    return combinations.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [combinations, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCombinations.length / itemsPerPage));

  // keep currentPage in range when list shrinks
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Fetch data
  const fetchData = async () => {
    try {
      const [subRes, progRes, combRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/programs"),
        api.get("/combinations"),
      ]);
      setSubjects(subRes.data || []);
      setPrograms(progRes.data || []);
      setCombinations(
        (combRes.data || []).map((c) => ({
          ...c,
          subjects: c.subjects || [],
          programs: c.programs || [],
        }))
      );
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = async (item) => {
    try {
      const res = await api.get(`/combinations/${item._id}`);
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
    setSelectedSubjects([]);
    setSelectedPrograms([]);
    setError("");
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditing(null);
    setName("");
    setSelectedSubjects([]);
    setSelectedPrograms([]);
    setError("");
  };

  const handleToggleSelection = (id, list, setList) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return setError("Name is required");
    if (selectedSubjects.length === 0) return setError("Select at least one subject");
    if (selectedPrograms.length === 0) return setError("Select at least one program");

    const payload = { name, subjects: selectedSubjects, programs: selectedPrograms };

    try {
      if (editing) {
        await api.put(`/combinations/${editing._id}`, payload);
        showNotification("Combination updated successfully!", "success");
      } else {
        await api.post("/combinations", payload);
        showNotification("Combination added successfully!", "success");
      }
      closeFormModal();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Action failed";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/combinations/${id}`);
      showNotification("Combination deleted successfully!", "success");
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      showNotification(errorMsg, "error");
    }
  };

  const handleEdit = (comb) => {
    setEditing(comb);
    setName(comb.name || "");
    setSelectedSubjects((comb.subjects || []).map((s) => s._id || s));
    setSelectedPrograms((comb.programs || []).map((p) => p._id || p));
    setFormModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white z-40 animate-fade-in ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Combinations</h1>
          <p className="text-gray-600">Manage school combinations and allowed programs</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            type="text"
            placeholder="Search combinations..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {user?.role === "admin" && (
            <button
              onClick={openFormModal}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg shadow hover:from-primary-dark hover:to-primary transition whitespace-nowrap"
            >
              + Add Combination
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
                <th className="p-4">Name</th>
                <th className="p-4">Subjects</th>
                <th className="p-4">Programs</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCombinations
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((comb) => (
                  <tr key={comb._id} className="hover:bg-blue-50 transition duration-150">
                    <td className="p-4 font-bold">{comb.name}</td>
                    <td className="p-4">
                      {(comb.subjects || []).map((s) => (
                        <span
                          key={s._id || s}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1"
                        >
                          {s.name || s}
                        </span>
                      ))}
                    </td>
                    <td className="p-4">
                      {(comb.programs || []).map((p) => (
                        <span
                          key={p._id || p}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs mr-1"
                        >
                          {p.name || p}
                        </span>
                      ))}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => openModal(comb)}
                        className="bg-blue-50 hover:bg-blue-100 text-primary px-3 py-2 rounded font-medium text-xs transition"
                      >
                        👁️ View
                      </button>
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(comb)}
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comb._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              {combinations.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">
                    No combinations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            Page <span className="text-primary font-bold">{currentPage}</span> of <span className="text-primary font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
          >
            Next →
          </button>
        </div>
      </div>

      {/* View Modal */}
      {modalOpen && modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{modalItem.name}</h2>
                <p className="text-blue-100 text-sm mt-1">Combination Details</p>
              </div>
              <button onClick={closeModal} className="text-blue-100 hover:text-white text-3xl font-light leading-none">×</button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">📚 Subjects</h3>
                <div className="space-y-2">
                  {(modalItem.subjects || []).length > 0 ? (
                    (modalItem.subjects || []).map(s => (
                      <div key={s._id || s} className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200 transition mr-2 mb-2">
                        ✓ {s.name || s}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No subjects</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">🎓 Programs</h3>
                <div className="space-y-2">
                  {(modalItem.programs || []).length > 0 ? (
                    (modalItem.programs || []).map(p => (
                      <div key={p._id || p} className="inline-flex items-center bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-green-200 transition mr-2 mb-2">
                        ✓ {p.name || p}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No programs</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer */}
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

      {/* Form Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <h2 className="text-2xl font-bold">{editing ? "Edit Combination" : "Add New Combination"}</h2>
              <p className="text-blue-100 text-sm mt-1">{editing ? "Update combination information" : "Create a new combination"}</p>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Combination Name</label>
                  <input
                    type="text"
                    placeholder="e.g., PCM, PCB..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {subjects.map(s => (
                      <label key={s._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(s._id)}
                          onChange={() => handleToggleSelection(s._id, selectedSubjects, setSelectedSubjects)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Programs</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {programs.map(p => (
                      <label key={p._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(p._id)}
                          onChange={() => handleToggleSelection(p._id, selectedPrograms, setSelectedPrograms)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{p.name}</span>
                      </label>
                    ))}
                  </div>
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

export default Combinations;