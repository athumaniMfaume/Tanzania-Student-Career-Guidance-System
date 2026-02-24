import { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Subjects = () => {
  const { user } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter & Pagination Logic
  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subjects, searchTerm]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage) || 1;
  const currentData = filteredSubjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const openModal = async (item) => {
    setModalOpen(true);
    try {
      const res = await api.get(`/subjects/${item._id}`);
      let subj = res.data;
      console.log("Subject with combinations:", subj);
      setModalItem(subj);
    } catch (err) {
      console.error("Error fetching subject:", err);
      setModalItem(item);
    }
  };

  const closeModal = () => { setModalOpen(false); setModalItem(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Subject name is required");

    try {
      if (editing) {
        await api.put(`/subjects/${editing._id}`, { name });
        showNotification("Subject updated successfully!", "success");
      } else {
        await api.post("/subjects", { name });
        showNotification("Subject added successfully!", "success");
      }
      setFormModalOpen(false);
      setName("");
      setEditing(null);
      fetchSubjects();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Action failed";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      showNotification("Subject deleted successfully!", "success");
      fetchSubjects();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      showNotification(errorMsg, "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white z-40 animate-fade-in ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-500">Manage academic subjects</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search subjects..." 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
          {user?.role === "admin" && (
            <button onClick={() => {setEditing(null); setName(""); setFormModalOpen(true);}} className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg hover:from-primary-dark hover:to-primary transition font-medium shadow-sm">
              + Add New
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-primary to-primary-dark text-white">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Subject Name</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="3" className="text-center py-10">Loading...</td></tr>
              ) : currentData.length > 0 ? (
                currentData.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-blue-50">
                    <td className="p-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{sub.name}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => openModal(sub)}
                        className="bg-blue-50 hover:bg-blue-100 text-primary px-3 py-2 rounded font-medium text-xs transition"
                      >
                        👁️ View
                      </button>
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => {setEditing(sub); setName(sub.name); setFormModalOpen(true);}}
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded font-medium text-xs transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
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
                <tr><td colSpan="3" className="text-center py-10 text-gray-500">No subjects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Page <span className="text-primary font-bold">{currentPage}</span> of <span className="text-primary font-bold">{totalPages}</span>
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          Next →
        </button>
      </div>

      {/* Form Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <h2 className="text-2xl font-bold">{editing ? "Edit Subject" : "Add New Subject"}</h2>
              <p className="text-blue-100 text-sm mt-1">{editing ? "Update subject information" : "Create a new academic subject"}</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                  <input
                    autoFocus
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Physics, Chemistry, Mathematics"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {setFormModalOpen(false); setEditing(null); setName("");}} 
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

      {/* View Modal */}
      {modalOpen && modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{modalItem.name}</h2>
                <p className="text-blue-100 text-sm mt-1">Subject Details</p>
              </div>
              <button onClick={closeModal} className="text-blue-100 hover:text-white text-3xl font-light leading-none">×</button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">📚 Related Combinations</h3>
                <div className="space-y-2">
                  {modalItem.combinations?.length > 0 ? (
                    modalItem.combinations.map(c => (
                      <div key={c._id || c} className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200 transition mr-2 mb-2">
                        ✓ {c.name || c}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">No combinations linked to this subject yet.</p>
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
    </div>
  );
};

export default Subjects;
