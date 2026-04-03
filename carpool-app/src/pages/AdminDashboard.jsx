import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRides, setSelectedRides] = useState([]); 

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const toggleRideSelection = (id) => {
  setSelectedRides((prev) =>
    prev.includes(id)
      ? prev.filter((r) => r !== id)
      : [...prev, id]
  );
};
  

  useEffect(() => {
    if (!token) {
      alert("Not logged in");
      navigate("/");
      return;
    }

    fetchUsers();
    fetchRides();
    // eslint-disable-next-line
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRides = async () => {
    try {
      const res = await fetch(`${API}/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRides(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  

  const banUser = async (id) => {
    await fetch(`${API}/ban-user/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const unbanUser = async (id) => {
    await fetch(`${API}/unban-user/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };
  // eslint-disable-next-line
  const deleteRide = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this ride?");
    if (!confirmDelete) return;

    await fetch(`${process.env.REACT_APP_API_URL}/api/admin/delete-ride/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // refresh rides
    fetchRides();

  } catch (err) {
    console.error("Delete ride error:", err);
  }
};
const deleteSelectedRides = async () => {
  if (selectedRides.length === 0) {
    alert("No rides selected");
    return;
  }

  const confirmDelete = window.confirm("Delete selected rides?");
  if (!confirmDelete) return;

  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/admin/delete-rides`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ rideIds: selectedRides }),
    });

    setSelectedRides([]);
    fetchRides();

  } catch (err) {
    console.error(err);
  }
};

  if (!Array.isArray(users) || !Array.isArray(rides) || !Array.isArray(bookings)) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <h2>Admin Dashboard</h2>
        <button style={styles.switchBtn} onClick={() => navigate("/search-ride")}>
          Switch to User App
        </button>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setTab("users")} style={tab === "users" ? styles.activeTab : styles.tab}>
          Users
        </button>
        <button onClick={() => setTab("rides")} style={tab === "rides" ? styles.activeTab : styles.tab}>
          Rides
        </button>
        <button onClick={() => setTab("bookings")} style={tab === "bookings" ? styles.activeTab : styles.tab}>
          Bookings
        </button>
      </div>

      {/* USERS */}
      {tab === "users" && (
        <div>
          {users.map((u) => (
            <div key={u._id} style={styles.card}>
              <div style={styles.userInfo}>
                <strong>{u.email}</strong>
                <span>ID: {u._id}</span>
              </div>

              <div style={styles.actionGroup}>
                <span style={u.isBanned ? styles.badgeRed : styles.badgeGreen}>
                  {u.isBanned ? "Banned" : "Active"}
                </span>

                {u.isBanned ? (
                  <button style={styles.successBtn} onClick={() => unbanUser(u._id)}>
                    Unban
                  </button>
                ) : (
                  <button style={styles.dangerBtn} onClick={() => banUser(u._id)}>
                    Ban
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RIDES */}
      {tab === "rides" && (
  <div>
    {/* BULK DELETE BUTTON */}
    <button
      onClick={deleteSelectedRides}
      style={{
        ...styles.dangerBtn,
        marginBottom: "15px",
      }}
    >
      Delete Selected ({selectedRides.length})
    </button>

    {Array.isArray(rides) ? (
      rides.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              checked={selectedRides.includes(r._id)}
              onChange={() => toggleRideSelection(r._id)}
            />

            <div>
              <strong>
                {r.from} → {r.to}
              </strong>
              <p>Driver: {r.driver?.email || "N/A"}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>Loading rides...</p>
    )}
  </div>
)}

      {/* BOOKINGS */}
      {tab === "bookings" && (
        <div>
          {bookings.map((b) => (
            <div key={b._id}>{b.ride?.from} → {b.ride?.to}</div>
          ))}
        </div>
      )}
    </div>
  );
} // ✅ THIS FIXES YOUR ERROR

export default AdminDashboard;

// ================= STYLES =================
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
    background: "#0f0f0f", // BLACK BG
    minHeight: "100vh",
    color: "#fff",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  switchBtn: {
    background: "#facc15", // YELLOW
    color: "#000",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },

  tab: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#1f1f1f",
    color: "#ccc",
    cursor: "pointer",
    border: "1px solid #333",
  },

  activeTab: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#dc2626", // RED
    color: "#fff",
    cursor: "pointer",
    border: "none",
    fontWeight: "600",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#1a1a1a",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    marginBottom: "12px",
    transition: "0.2s ease",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    color: "#e5e5e5",
  },

  badgeGreen: {
    background: "#16a34a",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  badgeRed: {
    background: "#dc2626",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dangerBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },

  successBtn: {
    background: "#facc15",
    color: "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },

  rideRoute: {
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "10px",
    color: "#facc15", // YELLOW highlight
  },

  from: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },

  to: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },

  arrow: {
    color: "#dc2626",
  },

  rideDetails: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#bbb",
    marginBottom: "10px",
  },

  rideFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    color: "#777",
  },

  rideId: {
    fontStyle: "italic",
  },
};