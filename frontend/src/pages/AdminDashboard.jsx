import { useState, useEffect, useContext } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [counts, setCounts] = useState({
    subjects: 0,
    schools: 0,
    programs: 0,
    jobs: 0,
    combinations: 0,
  });

  const fetchCounts = async () => {
    try {
      // Make all API calls in parallel
      const [subjectsRes, schoolsRes, programsRes, jobsRes, combinationsRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/schools"),
        api.get("/programs"),
        api.get("/jobs"),
        api.get("/combinations"),
      ]);

      setCounts({
        subjects: subjectsRes.data.length,
        schools: schoolsRes.data.length,
        programs: programsRes.data.length,
        jobs: jobsRes.data.length,
        combinations: combinationsRes.data.length,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCounts();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return <p className="text-center mt-10 text-red-600">Access denied</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Subjects</h2>
          <p className="text-3xl font-bold mt-2">{counts.subjects}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Schools</h2>
          <p className="text-3xl font-bold mt-2">{counts.schools}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Programs</h2>
          <p className="text-3xl font-bold mt-2">{counts.programs}</p>
        </div>

        <div className="bg-orange-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <p className="text-3xl font-bold mt-2">{counts.jobs}</p>
        </div>

        <div className="bg-pink-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Combinations</h2>
          <p className="text-3xl font-bold mt-2">{counts.combinations}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;