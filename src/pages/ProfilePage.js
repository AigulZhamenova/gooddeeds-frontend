import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { AuthContext } from "../contexts/AuthContext";
import { FiUser, FiCalendar, FiMail, FiPhone, FiStar } from "react-icons/fi";
import { getLevelName } from "../utils/levels";

import CreateEventModal from "../components/CreateEventModal";
import CreateInitiativeModal from "../components/CreateInitiativeModal";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // если нет пользователя, перенаправляем на главную
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [initiatives, setInitiatives] = useState([]);

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateInitiative, setShowCreateInitiative] = useState(false);

  const loadData = useCallback(() => {
    if (!user) return;
    axios.get(`${API_URL}/api/users/${user.id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setProfile(res.data))
      .catch(console.error);
    axios.get(`${API_URL}/api/events`,    { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setEvents(res.data.events || res.data))
      .catch(console.error);
    axios.get(`${API_URL}/api/initiatives`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setInitiatives(res.data.initiatives || res.data))
      .catch(console.error);
    axios.get(`${API_URL}/api/donations`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setDonations(res.data.filter(d => d.user._id === user.id)))
      .catch(console.error);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user || !profile) {
    return <div className="container mx-auto p-4">Загрузка…</div>;
  }

  const now = new Date();
  const userId = user.id;

  // участие пользователя
  const userEvents = userId ? events.filter(e => e.participants.some(p => p._id === userId)) : [];
  const futureUserEvents = userEvents.filter(e => new Date(e.date) >= now);
  const pastUserEvents   = userEvents.filter(e => new Date(e.date) < now);

  // админские мероприятия
  const adminEvents = userId ? events.filter(e => e.organizer._id === userId) : [];
  const futureAdminEvents = adminEvents.filter(e => new Date(e.date) >= now);
  const pastAdminEvents   = adminEvents.filter(e => new Date(e.date) < now);

  // админские сборы
  const adminInits = userId ? initiatives.filter(i => i.organizer._id === userId) : [];
  const activeInits = adminInits.filter(i => new Date(i.deadline) >= now);
  const pastInits   = adminInits.filter(i => new Date(i.deadline) < now);

  const userDonations = donations;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Профиль */}
      <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{profile.name} {profile.surname}</h1>
          <p className="flex items-center text-gray-600"><FiMail className="mr-2" />{profile.email}</p>
          <p className="flex items-center text-gray-600"><FiPhone className="mr-2" />{profile.phone}</p>
          {profile.birthday && <p className="flex items-center text-gray-600"><FiCalendar className="mr-2" />{new Date(profile.birthday).toLocaleDateString()}</p>}
        </div>
        <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Выйти</button>
      </div>

      {/* Волонтерская статистика */}
      {user.role !== 'admin' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Баллы и уровень</h2>
          <p className="flex items-center"><FiStar className="mr-2 text-yellow-500" />{profile.points} баллов</p>
          <p>Уровень: {getLevelName(profile.points, 'ru')}</p>
        </div>
      )}

      {/* Контент */}
      {user.role !== 'admin' ? (
        <>
          {/* Участие в мероприятиях */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Будущие мероприятия</h2>
            {futureUserEvents.length ? futureUserEvents.map(e => (
              <div key={e._id} className="flex justify-between">
                <Link to={`/event/${e._id}`} className="text-blue-600 hover:underline">{e.title}</Link>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </div>
            )) : <p className="text-gray-500">Нет предстоящих</p>}
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Прошедшие мероприятия</h2>
            {pastUserEvents.length ? pastUserEvents.map(e => (
              <div key={e._id} className="flex justify-between">
                <Link to={`/event/${e._id}`} className="text-blue-600 hover:underline">{e.title}</Link>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </div>
            )) : <p className="text-gray-500">Нет прошлых</p>}
          </div>
          {/* Донаты */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Мои пожертвования</h2>
            {userDonations.length ? userDonations.map(d => (
              <div key={d._id} className="flex justify-between">
                <span>{d.organization} — {d.amount}₸</span>
                {d.event && <Link to={`/event/${d.event}`} className="text-blue-600 hover:underline">Событие</Link>}
              </div>
            )) : <p className="text-gray-500">Нет пожертвований</p>}
          </div>
        </>
      ) : (
        <>
          {/* Админ: Мои мероприятия */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Мои мероприятия</h2>
            <button onClick={() => setShowCreateEvent(true)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">+ Создать мероприятие</button>
          </div>
          <div className="space-y-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-2">Будущие</h3>
              {futureAdminEvents.length ? futureAdminEvents.map(e => (
                <div key={e._id} className="flex justify-between">
                  <Link to={`/event/${e._id}`} className="text-blue-600 hover:underline">{e.title}</Link>
                  <span>{new Date(e.date).toLocaleDateString()}</span>
                </div>
              )) : <p className="text-gray-500">Нет будущих</p>}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-2">Прошедшие</h3>
              {pastAdminEvents.length ? pastAdminEvents.map(e => (
                <div key={e._id} className="flex justify-between">
                  <Link to={`/event/${e.__id}`} className="text-blue-600 hover:underline">{e.title}</Link>
                  <span>{new Date(e.date).toLocaleDateString()}</span>
                </div>
              )) : <p className="text-gray-500">Нет прошедших</p>}
            </div>
          </div>
          {/* Админ: Сборы */}
          <div className="flex justify-between items-center mt-8">
            <h2 className="text-xl font-semibold">Мои сборы</h2>
            <button onClick={() => setShowCreateInitiative(true)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">+ Создать сбор</button>
          </div>
          <div className="space-y-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-2">Активные</h3>
              {activeInits.length ? activeInits.map(i => (
                <div key={i._id} className="flex justify-between">
                  <Link to={`/initiative/${i._id}`} className="text-blue-600 hover:underline">{i.title}</Link>
                  <span>{i.raisedAmount}₸ / {i.targetAmount}₸</span>
                </div>
              )) : <p className="text-gray-500">Нет активных</p>}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-2">Завершённые</h3>
              {pastInits.length ? pastInits.map(i => (
                <div key={i._id} className="flex justify-between">
                  <Link to={`/initiative/${i._id}`} className="text-blue-600 hover:underline">{i.title}</Link>
                  <span>{i.raisedAmount}₸ / {i.targetAmount}₸</span>
                </div>
              )) : <p className="text-gray-500">Нет завершённых</p>}
            </div>
          </div>
          {/* Модалки */}
          <CreateEventModal isOpen={showCreateEvent} onClose={() => setShowCreateEvent(false)} onCreated={() => { setShowCreateEvent(false); loadData(); }} />
          <CreateInitiativeModal isOpen={showCreateInitiative} onClose={() => setShowCreateInitiative(false)} onCreated={() => { setShowCreateInitiative(false); loadData(); }} />
        </>
      )}
    </div>
  );
}
