import { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Jobs = () => {
  const { user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));

  const openModal = async (item) => {
    try {
      const res = await api.get(`/jobs/${item._id}`);
      setModalItem(res.data);
    } catch {
      setModalItem(item);
    }
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setModalItem(null); };

  const openFormModal = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setSelectedPrograms([]);
    setError("");
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditing(null);
    setTitle("");
    setDescription("");
    setSelectedPrograms([]);
    setError("");
  };

  const fetchData = async () => {
    try {
      const [jobsRes, progRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/programs"),
      ]);
      setJobs(jobsRes.data || []);
      setPrograms(progRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || selectedPrograms.length === 0) {
      setError("All fields and at least one program are required");
      return;
    }

    const payload = {
      title,
      description,
      relatedPrograms: selectedPrograms,
    };

    try {
      if (editing) {
        await api.put(`/jobs/${editing._id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }

      closeFormModal();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Action failed";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleSubmitWithNotification = async (e) => {
    e.preventDefault();
    if (!title || !description || selectedPrograms.length === 0) {
      setError("All fields and at least one program are required");
      return;
    }
    const payload = { title, description, relatedPrograms: selectedPrograms };
    try {
      if (editing) {
        await api.put(`/jobs/${editing._id}`, payload);
        showNotification("Job updated successfully!", "success");
      } else {
        await api.post("/jobs", payload);
        showNotification("Job added successfully!", "success");
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
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      showNotification("Job deleted successfully!", "success");
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      showNotification(errorMsg, "error");
    }
  };

  const handleEdit = (job) => {
    setEditing(job);
    setTitle(job.title || "");
    setDescription(job.description || "");
    setSelectedPrograms(job.relatedPrograms?.map((p) => p._id) || []);
    setFormModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white z-40 animate-fade-in ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A4.5 4.5 0 0116 13H4a2 2 0 00-2-2h-.5a1 1 0 110-2H2a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs & Careers</h1>
            <p className="text-gray-600 text-sm mt-1">Manage job opportunities and career pathways</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Search jobs by title or description..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        {user?.role === "admin" && (
          <button
            onClick={openFormModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:from-primary-dark hover:to-primary transition duration-200 font-medium shadow-md whitespace-nowrap"
          >
            <span>➕</span> Add New Job
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-dark text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Job Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Related Programs</th>
                {/* {user?.role === "admin" && ( */}
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                {/* )} */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((job, index) => (
                <tr key={job._id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{job.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(job.relatedPrograms || []).length > 0 ? (
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {(job.relatedPrograms || []).map((p) => p.name).join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button
                      onClick={() => openModal(job)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-xs font-medium transition"
                    >
                      👁️ View
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <button
                          className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-2 rounded-lg text-xs font-medium transition"
                          onClick={() => handleEdit(job)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium transition"
                          onClick={() => handleDelete(job._id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={user?.role === "admin" ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📭</span>
                      <p>No jobs found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Page <span className="text-primary font-bold">{currentPage}</span> of <span className="text-primary font-bold">{totalPages}</span>
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-primary rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-primary"
        >
          Next →
        </button>
      </div>

      {modalOpen && modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{modalItem.title}</h2>
                <p className="text-blue-100 text-sm mt-1">Job Details</p>
              </div>
              <button onClick={closeModal} className="text-blue-100 hover:text-white text-3xl font-light leading-none">×</button>
            </div>
            <div className="p-6 space-y-6">
              {modalItem.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">📄 Description</h3>
                  <p className="text-gray-700 leading-relaxed">{modalItem.description}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">🔗 Related Programs</h3>
                <div className="space-y-2">
                  {(modalItem.relatedPrograms || []).length > 0 ? (
                    (modalItem.relatedPrograms || []).map((p) => (
                      <div key={p._id || p} className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200 transition mr-2 mb-2">
                        ✓ {p.name || p}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">No programs related</p>
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

      {formModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <h2 className="text-2xl font-bold">{editing ? "Edit Job" : "Add New Job"}</h2>
              <p className="text-blue-100 text-sm mt-1">{editing ? "Update job information" : "Create a new job posting"}</p>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Data Analyst..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                  <textarea
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Related Programs</label>
                  <select
                    multiple
                    value={selectedPrograms}
                    onChange={(e) =>
                      setSelectedPrograms(Array.from(e.target.selectedOptions, (option) => option.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple programs</p>
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

export default Jobs;
