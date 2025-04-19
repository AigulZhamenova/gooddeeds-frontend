import axios from "axios";

const API_URL = "http://localhost:5000"; // Замените на реальный URL вашего API

// Авторизация пользователя
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

// Регистрация пользователя
export const registerUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};
ы