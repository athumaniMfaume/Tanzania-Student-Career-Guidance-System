import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Subjects from "./pages/Subjects.jsx";
import Combinations from "./pages/Combinations.jsx";
import Programs from "./pages/Programs.jsx";
import Schools from "./pages/Schools.jsx";
import Jobs from "./pages/Jobs.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="combinations" element={<Combinations />} />
          <Route path="programs" element={<Programs />} />
          <Route path="schools" element={<Schools />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;