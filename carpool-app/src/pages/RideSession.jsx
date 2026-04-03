import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RideSession() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/bookings/details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setBooking(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading ride...</p>;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDriver = user?.role === "driver";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ride Confirmed 🎉</h2>

      <p>
        <strong>Route:</strong>{" "}
        {booking?.ride?.from} → {booking?.ride?.to}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {booking?.ride?.date
          ? new Date(booking.ride.date).toLocaleString()
          : "N/A"}
      </p>

      {isDriver ? (
        <>
          <h3>Rider Details</h3>
          <p>Email: {booking?.rider?.email || "N/A"}</p>
        </>
      ) : (
        <>
          <h3>Driver Details</h3>
          <p>Email: {booking?.driver?.email || "N/A"}</p>
        </>
      )}
    </div>
  );
}

export default RideSession;