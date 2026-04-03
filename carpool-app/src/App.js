import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DriverDashboard from "./pages/DriverDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import CreateRide from "./pages/CreateRide";
import RideStatus from "./pages/RideStatus";
import SearchRide from "./pages/SearchRide";
import AvailableRides from "./pages/AvailableRides";
import AdminDashboard from "./pages/AdminDashboard";
import DriverRideConfirmed from "./pages/DriverRideConfirmed";
import RideSession from "./pages/RideSession";

import "./App.css";

// ✅ PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

// ✅ ADMIN ROUTE
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  const [rides, setRides] = useState([]); // 🔥 THIS WAS MISSING
  // eslint-disable-next-line 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "";
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup/:role" element={<Signup />} />

        {/* DRIVER DASHBOARD */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute>
              <DriverDashboard rides={rides} />
            </ProtectedRoute>
          }
        />

        {/* RIDER DASHBOARD */}
        <Route
          path="/rider/dashboard"
          element={
            <ProtectedRoute>
              <RiderDashboard rides={rides} />
            </ProtectedRoute>
          }
        />

        {/* CREATE RIDE */}
        <Route
          path="/driver/create-ride"
          element={
            <ProtectedRoute>
              <CreateRide setRides={setRides} />
            </ProtectedRoute>
          }
        />

        {/* SEARCH */}
        <Route
          path="/search-ride"
          element={
            <ProtectedRoute>
              <SearchRide />
            </ProtectedRoute>
          }
        />

        {/* AVAILABLE RIDES */}
        <Route
          path="/available-rides"
          element={
            <ProtectedRoute>
              <AvailableRides rides={rides} />
            </ProtectedRoute>
          }
        />

        {/* RIDE STATUS */}
        <Route
          path="/ride/status/:status"
          element={
            <ProtectedRoute>
              <RideStatus />
            </ProtectedRoute>
          }
        />

        {/* DRIVER CONFIRM */}
        <Route
          path="/driver/ride-confirmed"
          element={
            <ProtectedRoute>
              <DriverRideConfirmed />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/ride-session/:id" element={<RideSession />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;