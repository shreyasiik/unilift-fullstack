import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const isDriverDashboard = path.startsWith("/driver");
  const isRiderDashboard = path.startsWith("/rider");

  const showSwitchButton = isDriverDashboard || isRiderDashboard;

  return (
    

    <div className="header">
      <div className="header-left" onClick={() => navigate("/")}>
        <span className="brand-white">Uni</span>
        <span className="brand-yellow">Lift</span>
      </div>
      

      <div className="header-right">
        {showSwitchButton && (
          <button
            className="switch-btn"
            onClick={() =>
              navigate(
                isDriverDashboard
                  ? "/search-ride"
                  : "/driver/dashboard"
              )
            }
          >
            {isDriverDashboard
              ? "Switch to Receive Ride"
              : "Switch to Give Ride"}
          </button>
        )}

        <button className="home-btn" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
}

export default Header;
