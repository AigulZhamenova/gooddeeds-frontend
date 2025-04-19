// src/components/MapComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Переопределяем дефолтные иконки для Leaflet (иначе могут не отображаться)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const MapComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/events`)
      .then((res) => setEvents(res.data.events || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <MapContainer
      center={[43.238949, 76.889709]} // координаты Алматы
      zoom={10}
      className="h-80 w-full rounded"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {events.map((event) => (
        event.latitude && event.longitude && (
          <Marker
            key={event._id}
            position={[event.latitude, event.longitude]}
          >
            <Popup>
              <strong>{event.title}</strong><br />
              {event.location}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;
