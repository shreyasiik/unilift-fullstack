import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL;

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      `${API}/api/auth/login`,
      { email, password },
      
    );

    if (res.status === 200) {
      // ✅ STORE USER (THIS WAS MISSING)
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("Stored user:", res.data.user); // debug
console.log(process.env.REACT_APP_API_URL);
      // optional: if admin → go to admin dashboard
      if (res.data.user.isAdmin) {
        navigate("/admin");
        return;
      }

      if (role === "driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/search-ride");
      }
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Header />

      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">
            {role === "driver" ? "Driver Login" : "Rider Login"}
          </h2>

          <p style={{ textAlign: "center", marginBottom: "15px" }}>
            {role === "driver"
              ? "Login to manage your rides"
              : "Login to find rides near you"}
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            className="auth-link"
            onClick={() => navigate(`/signup/${role}`)}
            style={{ cursor: "pointer" }}
          >
            Don’t have an account? Sign up
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;