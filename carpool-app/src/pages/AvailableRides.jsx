import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function AvailableRides() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);

  const [maxPrice, setMaxPrice] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const handleRequestRide = async (rideId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/bookings/request/${rideId}`,
      {
        method: "POST",
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
    localStorage.setItem("pendingBookingId", data.booking._id);
    alert("Ride request sent!");

  } catch (err) {
    console.error(err);
    alert("Failed to request ride");
  }
};

  // 🔥 FETCH RIDES FROM BACKEND
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/rides`);
        const data = await res.json();

        console.log("RIDES API:", data);

        if (Array.isArray(data)) {
          setRides(data);
          setFilteredRides(data);
        } else {
          console.error("Invalid response:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchRides();
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  const checkStatus = async () => {
    try {
      const id = localStorage.getItem("pendingBookingId");
      if (!id) return;

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.status === "accepted") {
        alert("🎉 Ride Accepted!");

        localStorage.removeItem("pendingBookingId");

        navigate(`/ride-session/${id}`);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const interval = setInterval(checkStatus, 3000);

  return () => clearInterval(interval);
}, [navigate]); // ✅ no navigate here

  // 🔥 APPLY FILTERS
  const applyFilters = () => {
    let filtered = [...rides];

    if (maxPrice) {
      filtered = filtered.filter((r) => r.price <= maxPrice);
    }

    if (minSeats) {
      filtered = filtered.filter((r) => r.seatsAvailable >= minSeats);
    }

    setFilteredRides(filtered);
  };

  return (
    <>
      <Header />

      <div className="dashboard">
        <h2>Available Rides 🚕</h2>

        {/* FILTERS */}
        <div style={{ margin: "20px 0" }}>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Seats"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
          />

          <button onClick={applyFilters} className="primary-btn">
            Apply Filters
          </button>
        </div>

        {/* RIDES LIST */}
        {filteredRides.length === 0 ? (
          <p>No rides available</p>
        ) : (
          filteredRides.map((ride) => (
            <div key={ride._id} className="ride-card">
              <h3>
                {ride.from} → {ride.to}
              </h3>

              <p>₹{ride.price}</p>
              <p>{ride.seatsAvailable} seats</p>

              <p>
                {new Date(ride.date).toLocaleString("en-IN")}
              </p>
              <button
              className="primary-btn"
              style={{ marginTop: "10px" }}
              onClick={() => handleRequestRide(ride._id)}
            >
              Request Ride
            </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AvailableRides;