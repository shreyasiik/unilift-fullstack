  import { useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import Header from "../components/Header";
  import API_BASE from "../config";

  function Signup() {
    const navigate = useNavigate();
    const { role } = useParams();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const [license, setLicense] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    /* ================= SEND OTP ================= */
const sendOtp = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent successfully");
      setOtpSent(true);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    alert("Server error while sending OTP");
  }
};
    /* ================= VERIFY OTP ================= */

    const verifyOtp = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("OTP verified");
          setOtpVerified(true);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log("VERIFY OTP ERROR:", err);
        alert("Server error while verifying OTP");
      }
    };

    /* ================= REGISTER ================= */

    const handleRegister = async (e) => {
      e.preventDefault();

      if (!otpVerified) {
        alert("Please verify OTP first");
        return;
      }

      if (role === "driver") {
        if (!license.trim() || !vehicleNumber.trim() || !vehicleType) {
          alert("Driver details required");
          return;
        }
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            role,
            drivingLicense: license.trim(),
            vehicleNumber: vehicleNumber.trim(),
            vehicleType,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful");
          navigate(`/login/${role}`);
        } else {
          if (data.redirectToLogin) {
            const goToLogin = window.confirm(
              "Account already exists. Do you want to login instead?"
            );

            if (goToLogin) {
              navigate(`/login/${role}`);
            }
          } else {
            alert(data.message);
          }
        }
      } catch (err) {
        console.log("REGISTER ERROR:", err);
        alert("Server error during registration");
      }
    };

    return (
      <>
        <Header />

        <div className="auth-page">
          <form className="auth-card" onSubmit={handleRegister}>
            <h2 className="auth-title">
              {role === "driver" ? "Driver Signup" : "Rider Signup"}
            </h2>

            <input
              type="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!otpSent && (
              <button type="button" className="primary-btn" onClick={sendOtp}>
                Send OTP
              </button>
            )}

            {otpSent && !otpVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="primary-btn"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </>
            )}

            {otpVerified && (
              <>
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {role === "driver" && (
                  <>
                    <input
                      type="text"
                      placeholder="Driving License Number"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      required
                    />

                    <input
                      type="text"
                      placeholder="Vehicle Number"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                    />

                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Bike">Bike</option>
                      <option value="Car">Car</option>
                    </select>
                  </>
                )}

                <button type="submit" className="primary-btn">
                  Complete Registration
                </button>
              </>
            )}
          </form>
        </div>
      </>
    );
  }

  export default Signup;