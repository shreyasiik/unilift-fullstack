import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ORS_KEY = process.env.REACT_APP_ORS_KEY;

/* 📍 Pickup Marker */
const pickupIcon = L.divIcon({
  html: "<div style='font-size:34px;'>📍</div>",
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

/* 🔵 Live Dot */
const liveIcon = L.divIcon({
  html: "<div style='width:16px;height:16px;background:#007bff;border-radius:50%;border:3px solid white;'></div>",
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* 🗺 Smooth Recenter */
function RecenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 17, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [coords, map]);

  return null;
}

/* 🔵 Live Location + Accuracy */
function LiveLocation({ setAddress, setCoords }) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setAccuracy(pos.coords.accuracy);
        setCoords({ lat, lng });

        try {
          const response = await fetch(
            `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_KEY}&point.lon=${lng}&point.lat=${lat}`
          );

          const data = await response.json();

          if (data.features && data.features.length > 0) {
            setAddress(data.features[0].properties.label);
          }
        } catch (err) {
          console.log("Reverse geocode error:", err);
        }
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setAddress, setCoords]);

  return position ? (
    <>
      <Marker position={position} icon={liveIcon} />
      <Circle
        center={position}
        radius={accuracy}
        pathOptions={{
          color: "#007bff",
          fillColor: "#007bff",
          fillOpacity: 0.15,
        }}
      />
    </>
  ) : null;
}

/* 📍 Click Selection */
function LocationMarker({ setAddress, setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);
      setCoords({ lat, lng });

      try {
        const response = await fetch(
          `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_KEY}&point.lon=${lng}&point.lat=${lat}`
        );

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].properties.label);
        }
      } catch (err) {
        console.log("Reverse geocode error:", err);
      }
    },
  });

  return position ? <Marker position={position} icon={pickupIcon} /> : null;
}

function SearchRide() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickup: "",
    pickupCoords: null,
    drop: "",
  });

  /* 🔎 Forward Geocode */
  const handlePickupBlur = async () => {
    if (!form.pickup) return;

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_KEY}&text=${form.pickup}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        const lng = coords[0];
        const lat = coords[1];

        setForm((prev) => ({
          ...prev,
          pickupCoords: { lat, lng },
        }));
      }
    } catch (err) {
      console.log("Forward geocode error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/available-rides", { state: form });
  };

  return (
    <>
      <Header />

      <div className="auth-page">
        <div className="auth-card large-card">
          <h2 className="auth-title">Where do you want to go?</h2>

          <input
            value={form.pickup}
            placeholder="Pickup Location"
            onChange={(e) =>
              setForm({ ...form, pickup: e.target.value })
            }
            onBlur={handlePickupBlur}
            required
          />

          <div className="map-wrapper">
            <MapContainer
              center={[22.7196, 75.8577]}
              zoom={16}
              className="map-container"
            >
              <RecenterMap coords={form.pickupCoords} />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <LiveLocation
                setAddress={(address) =>
                  setForm((prev) => ({ ...prev, pickup: address }))
                }
                setCoords={(coords) =>
                  setForm((prev) => ({
                    ...prev,
                    pickupCoords: coords,
                  }))
                }
              />

              <LocationMarker
                setAddress={(address) =>
                  setForm((prev) => ({ ...prev, pickup: address }))
                }
                setCoords={(coords) =>
                  setForm((prev) => ({
                    ...prev,
                    pickupCoords: coords,
                  }))
                }
              />
            </MapContainer>
          </div>

          <form onSubmit={handleSearch}>
            <input
              placeholder="Drop Location"
              value={form.drop}
              onChange={(e) =>
                setForm({ ...form, drop: e.target.value })
              }
              required
            />

            <button className="primary-btn">
              Search Rides
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SearchRide;
