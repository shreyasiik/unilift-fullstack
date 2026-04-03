import Header from "../components/Header";
import RideCard from "../components/RideCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // ✅ FIX

function DriverDashboard({ rides }) {
  const navigate = useNavigate();

  // ✅ MOVE INSIDE COMPONENT
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/bookings/driver", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setRequests(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);
  const handleAccept = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/bookings/accept/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // 🔥 REDIRECT DRIVER
    navigate(`/ride-session/${id}`);

  } catch (err) {
    console.error(err);
  }
};
const handleReject = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/bookings/reject/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRequests((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, status: "rejected" } : r
      )
    );

  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <Header />

      <div className="dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Your Published Rides</h2>

          <button
            className="primary-btn"
            onClick={() => navigate("/driver/create-ride")}
          >
            + Publish Ride
          </button>
        </div>

        {/* RIDES */}
        {rides.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            <p style={{ marginBottom: "15px" }}>
              You haven’t published any rides yet.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/driver/create-ride")}
            >
              Create Your First Ride
            </button>
          </div>
        ) : (
          rides.map((ride) => (
            <RideCard key={ride._id} mode="driver" ride={ride} />
          ))
        )}

        {/* REQUESTS SECTION (you were missing this) */}
        <h3 style={{ marginTop: "30px" }}>Ride Requests</h3>

{requests.length === 0 ? (
  <p>No requests yet</p>
) : (
  requests.map((req) => (
    <div key={req._id} className="ride-card">
      
      {/* USER INFO */}
      <p><strong>User:</strong> {req.user?.email}</p>
      <p><strong>Phone:</strong> {req.user?.phone || "N/A"}</p>

      {/* RIDE INFO */}
      <p>
        <strong>Ride:</strong> {req.ride?.from} → {req.ride?.to}
      </p>

      {/* STATUS */}
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color:
              req.status === "accepted"
                ? "green"
                : req.status === "rejected"
                ? "red"
                : "orange",
          }}
        >
          {req.status}
        </span>
      </p>

      {/* ACTION BUTTONS */}
      {req.status === "pending" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            className="primary-btn"
            onClick={() => handleAccept(req._id)}
          >
            Accept
          </button>

          <button
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => handleReject(req._id)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  ))
)}
      </div>
    </>
  );
}

export default DriverDashboard;