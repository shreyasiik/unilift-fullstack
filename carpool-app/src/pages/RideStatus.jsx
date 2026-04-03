import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

function RideStatus() {
  const { status } = useParams(); // accepted | rejected
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          {status === "accepted" ? (
            <>
              <h2 style={{ color: "green" }}>Ride Accepted 🎉</h2>
              <p>Your ride has been confirmed.</p>
              <p>Driver will reach you shortly.</p>
            </>
          ) : (
            <>
              <h2 style={{ color: "red" }}>Ride Rejected ❌</h2>
              <p>Unfortunately, the ride was not available.</p>
              <p>Please try another ride.</p>
            </>
          )}

          <button
            className="primary-btn"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default RideStatus;
