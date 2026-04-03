import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="home-container">
        <h1>Where are you headed today?</h1>

        <div className="choice-box">
          <div
            className="choice-card driver"
            onClick={() => navigate("/login/driver")}
          >
            <h2>Give a Ride</h2>
            <p>Earn money on your daily route</p>
          </div>

          <div
            className="choice-card rider"
            onClick={() => navigate("/login/rider")}
          >
            <h2>Receive a Ride</h2>
            <p>Quick, affordable rides</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
