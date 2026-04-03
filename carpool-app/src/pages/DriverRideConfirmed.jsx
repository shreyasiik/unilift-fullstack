import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function DriverRideConfirmed() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "green" }}>Ride Booked 🚀</h2>

          <p style={{ marginTop: "10px" }}>
            A rider has successfully booked your ride.
          </p>

          <p>Please be ready at the pickup location.</p>

          <button
            className="primary-btn"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/driver/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}

export default DriverRideConfirmed;
