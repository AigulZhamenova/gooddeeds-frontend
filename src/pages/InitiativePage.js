// src/pages/InitiativePage.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FiCalendar, FiUser, FiPhone } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "../components/LoginModal";
import Donation from "../components/Donation"; // ваша модалка для донатов

export default function InitiativePage() {
  const { id } = useParams();
  const { user, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [initiative, setInitiative] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
  });

  const loadInitiative = useCallback(() => {
    axios
      .get(`${API_URL}/api/initiatives/${id}`, {
        headers: user && { Authorization: `Bearer ${user.token}` },
      })
      .then(res => {
        setInitiative(res.data);
        // подготовить поля для редактирования
        setFormData({
          title: res.data.title,
          description: res.data.description,
          targetAmount: res.data.targetAmount,
          deadline: res.data.deadline.slice(0, 10),
        });
      })
      .catch(err => console.error(err));
  }, [id, user]);

  useEffect(() => {
    loadInitiative();
  }, [loadInitiative]);

  if (!initiative) {
    return <div className="container mx-auto p-4">Загрузка…</div>;
  }

  const isOrganizer = user?.id === initiative.organizer._id;
  const isUser = user?.role === "user";

  // после успешного логина в модалке сразу открываем DonateModal
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowDonate(true);
  };

  const handleDonateClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowDonate(true);
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        targetAmount: Number(formData.targetAmount),
        deadline: formData.deadline,
      };
      const res = await axios.put(
        `${API_URL}/api/initiatives/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInitiative(res.data);
      setEditMode(false);
      alert("Изменения сохранены");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Ошибка при сохранении");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Навигация назад и заголовок */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
        >
          Назад
        </button>
        <h1 className="text-3xl font-bold flex-grow text-center">
          {initiative.title}
        </h1>
      </div>

      {/* Инфоблок: дедлайн, организатор */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2" />
          <span>Собрано: {initiative.raisedAmount}₸ / {initiative.targetAmount}₸</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2" />
          <span>Дедлайн: {new Date(initiative.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiUser className="mr-2" />
          <span>Организатор: {initiative.organizer.name} {initiative.organizer.surname}</span>
          <FiPhone className="ml-4 mr-1" />
          <span>{initiative.organizer.phone || "–"}</span>
        </div>
      </div>

      {/* Кнопки для организатора */}
      {isOrganizer && (
        <div className="flex space-x-2">
          <button
            onClick={() => setShowParticipants(p => !p)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Участники
          </button>
          <button
            onClick={() => setEditMode(e => !e)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editMode ? "Отменить" : "Редактировать"}
          </button>
        </div>
      )}

      {/* Форма редактирования */}
      {editMode && (
        <form onSubmit={handleSave} className="bg-white shadow rounded-lg p-4 space-y-4">
          <input
            value={formData.title}
            onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
            className="w-full border rounded p-2"
            placeholder="Название"
          />
          <textarea
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
            className="w-full border rounded p-2"
            placeholder="Описание"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              value={formData.targetAmount}
              onChange={e => setFormData(f => ({ ...f, targetAmount: e.target.value }))}
              className="border rounded p-2 flex-1"
              placeholder="Целевая сумма"
            />
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData(f => ({ ...f, deadline: e.target.value }))}
              className="border rounded p-2 flex-1"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Сохранить
          </button>
        </form>
      )}

      {/* Список участников */}
      {showParticipants && (
        <div className="bg-white shadow rounded-lg p-4 space-y-2">
          {initiative.participants.length > 0 ? (
            initiative.participants.map(u => (
              <div key={u._id} className="flex justify-between border-b py-2">
                <span>{u.name} {u.surname}</span>
                <span>{u.phone || "–"}</span>
              </div>
            ))
          ) : (
            <p>Нет участников</p>
          )}
        </div>
      )}

      {/* Описание */}
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">{initiative.description}</p>
      </div>

      {/* Кнопка «Пожертвовать» для пользователей */}
      {isUser && (
        <button
          onClick={handleDonateClick}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
        >
          Пожертвовать
        </button>
      )}
      {!user && (
        <button
          onClick={() => setShowLogin(true)}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
        >
          Пожертвовать
        </button>
      )}

      {/* LoginModal и DonateModal */}
      {showLogin && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
      {showDonate && (
        <Donation
          initiative={initiative}
          onClose={() => setShowDonate(false)}
          onSuccess={() => {
            setShowDonate(false);
            loadInitiative();
            refreshProfile();
          }}
        />
      )}
    </div>
  );
}
