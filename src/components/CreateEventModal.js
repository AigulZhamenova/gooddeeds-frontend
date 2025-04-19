// src/components/CreateEventModal.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { API_URL } from "../config";

export default function CreateEventModal({ isOpen, onClose, onCreated }) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    availableSpots: "",
    category: ""
  });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const isoDate = `${form.date}T${form.time}`;
      const payload = {
        title: form.title,
        description: form.description,
        date: isoDate,
        location: form.location,
        availableSpots: Number(form.availableSpots),
        category: form.category
      };

      console.log("Creating event at:", API_URL + "/api/events");

      
      const res = await axios.post(
        `${API_URL}/api/events`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onCreated(res.data);    // передаём новое событие наверх
      onClose();
    } catch (err) {
      console.error("Ошибка создания события — response:", err.response);
      console.error("Ошибка создания события — data:", err.response?.data);
      console.log(user);
      setError(err.response?.data?.message || "Ошибка при создании");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-xl z-[1001]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >✕</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Новое событие</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title" value={form.title} onChange={handleChange}
            required placeholder="Название"
            className="w-full border rounded p-2"
          />
          <textarea
            name="description" value={form.description} onChange={handleChange}
            required placeholder="Описание"
            className="w-full border rounded p-2"
          />
          <div className="flex space-x-2">
            <input
              type="date" name="date" value={form.date} onChange={handleChange}
              required className="border rounded p-2 flex-1"
            />
            <input
              type="time" name="time" value={form.time} onChange={handleChange}
              required className="border rounded p-2 flex-1"
            />
          </div>
          <input
            name="location" value={form.location} onChange={handleChange}
            required placeholder="Локация"
            className="w-full border rounded p-2"
          />
          <div className="flex space-x-2">
            <input
              type="number" name="availableSpots"
              value={form.availableSpots} onChange={handleChange}
              required placeholder="Мест"
              className="border rounded p-2 flex-1"
            />
            <select
              name="category" value={form.category} onChange={handleChange}
              required className="border rounded p-2 flex-1"
            >
              <option value="">Категория</option>
              <option value="экология">Экология</option>
              <option value="дети">Дети</option>
              <option value="пожилые">Пожилые</option>
              <option value="животные">Животные</option>
              <option value="образование">Образование</option>
              <option value="здравоохранение">Здравоохранение</option>
              <option value="гуманитарная помощь">Гуманитарная помощь</option>
              <option value="культура">Культура</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  );
}
