// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import EventCard from "../components/EventCard";
import FilterBar from "../components/FilterBar";
import MapComponent from "../components/MapComponent";
import CreateEventModal from "../components/CreateEventModal";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${API_URL}/api/events`)
      .then((res) => {
        setEvents(res.data.events || res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredEvents = filter
    ? events.filter((e) => e.category === filter)
    : events;

  const handleCreated = newEvent => {
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Волонтёрские мероприятия</h1>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Создать мероприятие
          </button>
        )}
      </div>

      {/* Модалка создания */}
      <CreateEventModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {/* Фильтры */}
      <FilterBar filter={filter} setFilter={setFilter} />

      {/* Список карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {filteredEvents.length ? (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p>Мероприятия не найдены.</p>
        )}
      </div>

      {/* Отступ перед картой */}
      <div className="mt-12">
        <MapComponent />
      </div>
    </div>
  );
};

export default HomePage;
