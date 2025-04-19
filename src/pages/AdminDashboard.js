import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { API_URL } from "../config";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [availableSpots, setAvailableSpots] = useState("");
  const [file, setFile] = useState(null);

  if (!user || user.role !== "admin") {
    return <div className="container mx-auto p-4">Доступ запрещен</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("availableSpots", availableSpots);
    if (file) {
      formData.append("file", file);
    }

    axios.post(`${API_URL}/api/events`, formData, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (res.data._id) {
          alert("Мероприятие опубликовано");
          setTitle("");
          setDescription("");
          setDate("");
          setLocation("");
          setAvailableSpots("");
          setFile(null);
        } else {
          alert("Ошибка публикации");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка публикации");
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель: Создать мероприятие</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название мероприятия</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Дата и время</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Место проведения</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Количество мест</label>
          <input
            type="number"
            value={availableSpots}
            onChange={(e) => setAvailableSpots(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Изображение/видео (опционально)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Опубликовать
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
