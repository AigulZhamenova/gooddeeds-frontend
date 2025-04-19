import axios from "axios";

const API_URL = "http://localhost:5000"; // Замените на реальный URL вашего API

// Получение всех мероприятий
export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

// Получение деталей мероприятия
export const getEventDetails = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};
