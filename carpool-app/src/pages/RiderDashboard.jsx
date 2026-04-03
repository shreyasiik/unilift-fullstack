import Header from "../components/Header";
import RideCard from "../components/RideCard";

function RiderDashboard({ rides }) {
  return (
    <>
      <Header />

      <div className="dashboard">
        <h2>Available Rides</h2>

        {rides.length === 0 ? (
          <p>No rides available yet.</p>
        ) : (
          rides.map((ride, index) => (
            <RideCard key={index} mode="rider" ride={ride} />
          ))
        )}
      </div>
    </>
  );
}

export default RiderDashboard;
