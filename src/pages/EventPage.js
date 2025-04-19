import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "../components/LoginModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getLevelName } from "../utils/levels";
import { FiPhone } from "react-icons/fi";

// Настройка иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png")
});

export default function EventPage() {
  const { id } = useParams();
  const { user, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", date: "", time: "", availableSpots: "" });

  // Загрузка события
  const loadEvent = useCallback(() => {
    axios.get(`${API_URL}/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
        const iso = new Date(res.data.date).toISOString();
        setFormData({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          date: iso.slice(0,10),
          time: iso.slice(11,16),
          availableSpots: res.data.availableSpots
        });
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => { loadEvent(); }, [loadEvent]);

  if (!event) return <div className="container mx-auto p-4">Загрузка...</div>;

  const isAdmin = user?.role === 'admin';
  const isCreator = isAdmin && event.organizer._id === user.id;
  const isRegistered = user && event.participants.some(p => p._id === user.id);
  const canCancel = (new Date(event.date) - new Date()) > 24*60*60*1000;

  // Регистрация
  const handleUserRegister = async () => {
    if (!user?.id) return;
    try {
      const { data } = await axios.post(
        `${API_URL}/api/events/${id}/register`,
        { userId: user.id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEvent(data.event);
      setJustRegistered(true);
      alert("Вы успешно записались! Отменить можно за 24 часа до начала.");
      await refreshProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Не удалось записаться");
    }
  };

  // Отмена регистрации
  const handleCancel = async () => {
    if (!canCancel) {
      alert("Отмена невозможна: осталось меньше 24 часов");
      return;
    }
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/events/${id}/register`,
        { headers: { Authorization: `Bearer ${user.token}` }, data: { userId: user.id } }
      );
      setEvent(data.event);
      setJustRegistered(false);
      alert("Вы успешно отменили запись");
      await refreshProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Не удалось отменить запись");
    }
  };

  // Сохранение редактирования
  const handleSave = async e => {
    e.preventDefault();
    try {
      const iso = `${formData.date}T${formData.time}`;
      const res = await axios.put(
        `${API_URL}/api/events/${id}`,
        { ...formData, date: iso },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEvent(res.data);
      setEditMode(false);
      alert("Сохранено");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Не удалось сохранить");
    }
  };

  const handleSuccess = async () => { setShowLogin(false); await handleUserRegister(); };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Навигация назад и заголовок */}
      <div className="relative flex items-center">
        <button onClick={() => navigate(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">Назад</button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold">{event.title}</h1>
      </div>

      {/* Инфоблок */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <div className="flex items-center text-gray-600"><FiCalendar className="mr-2"/><span>{new Date(event.date).toLocaleDateString()}</span></div>
        <div className="flex items-center text-gray-600"><FiClock className="mr-2"/><span>{new Date(event.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>
        <div className="flex items-center text-gray-600"><FiUser className="mr-2"/><span>Организатор: {event.organizer.name} {event.organizer.surname}</span></div>
        <div className="flex items-center text-gray-600"><FiPhone className="mr-2" /><span>Телефон: {event.organizer.phone || "не указан"}</span></div>
      <div className="flex items-center text-gray-600"><FiMapPin className="mr-2"/><span>{event.location}</span></div>
      </div>

      {/* Админские кнопки: только для организатора */}
      {isAdmin && (
        <div className="flex space-x-2">
          {isCreator ? (
            <>
              <button onClick={() => setShowParticipants(p => !p)} className="bg-gray-500 text-white px-4 py-2 rounded">Участники</button>
              <button onClick={() => setEditMode(e => !e)} className="bg-green-500 text-white px-4 py-2 rounded">{editMode ? "Отменить" : "Редактировать"}</button>
            </>
          ) : (
            <button onClick={() => setShowParticipants(p => !p)} className="bg-gray-500 text-white px-4 py-2 rounded">Участники</button>
          )}
        </div>
      )}

      {/* Форма редактирования */}
      {editMode && (
        <form onSubmit={handleSave} className="bg-white shadow rounded-lg p-4 space-y-4">
          <input value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} className="w-full border rounded p-2" placeholder="Название" />
          <textarea value={formData.description} onChange={e => setFormData(f => ({...f, description: e.target.value}))} className="w-full border rounded p-2" placeholder="Описание" />
          <div className="flex space-x-2">
            <input type="date" value={formData.date} onChange={e => setFormData(f => ({...f, date: e.target.value}))} className="border rounded p-2 flex-1" />
            <input type="time" value={formData.time} onChange={e => setFormData(f => ({...f, time: e.target.value}))} className="border rounded p-2 flex-1" />
          </div>
          <input value={formData.location} onChange={e => setFormData(f => ({...f, location: e.target.value}))} className="w-full border rounded p-2" placeholder="Локация" />
          <input type="number" value={formData.availableSpots} onChange={e => setFormData(f => ({...f, availableSpots: e.target.value}))} className="border rounded p-2" placeholder="Мест" />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Сохранить</button>
        </form>
      )}

      {/* Список участников */}
      {showParticipants && (
        <div className="bg-white shadow rounded-lg p-4 space-y-2">
          {event.participants.length ? event.participants.map(u => (
            <div key={u._id} className="flex justify-between border-b py-2">
              <span className="font-semibold">{u.name} {u.surname}</span><br/>
              <span className="text-sm text-gray-600">Телефон: {u.phone || "–"}</span>
              <span>{u.points} {u.points===1?"балл":"баллов"}, уровень: {getLevelName(u.points,'ru')}</span>
            </div>
          )) : <p>Нет участников</p>}
        </div>
      )}

      {/* Описание */}
      <div className="bg-white shadow rounded-lg p-6"><p className="text-gray-700">{event.description}</p></div>

      {/* Кнопки записи/отмены */}
      <div>
        {!user ? (
       <>
            <button onClick={() => setShowLogin(true)} className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Записаться</button>
            {showLogin && <LoginModal onSuccess={handleSuccess} onClose={() => setShowLogin(false)} />}
          </>
        ) : user.role==="user" ? (
          isRegistered ? (
            <button onClick={handleCancel} disabled={!canCancel} className={`py-2 px-6 rounded ${canCancel?"bg-red-500 text-white hover:bg-red-600":"bg-gray-300 text-gray-600 cursor-not-allowed"}`}>Отменить запись</button>
          ) : (
            <button onClick={handleUserRegister} className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Записаться</button>
          )
        ) : null}
      </div>

      {/* Карта */}
      {event.latitude && event.longitude && (
        <div className="mt-8">
          <MapContainer center={[event.latitude, event.longitude]} zoom={13} className="h-80 w-full rounded shadow-md">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={[event.latitude, event.longitude]}><Popup><strong>{event.title}</strong><br />{event.location}</Popup></Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}
