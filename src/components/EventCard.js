// src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

const EventCard = ({ event }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col">
    <div className="p-4 flex-grow">
      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <div className="flex items-center text-gray-600 text-sm mb-1">
        <FiCalendar className="mr-1" />
        <span>{new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <FiClock className="mr-1" />
        <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm">
        <FiMapPin className="mr-1" />
        <span>{event.location}</span>
      </div>
    </div>
    <div className="p-4">
      <Link
        to={`/event/${event._id}`}
        className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Подробнее
      </Link>
    </div>
  </div>
);

export default EventCard;
