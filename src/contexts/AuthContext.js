// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // При старте читаем из localStorage
  useEffect(() => {
    const stored = localStorage.getItem("gooddeedsUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const persist = u => {
    setUser(u);
    localStorage.setItem("gooddeedsUser", JSON.stringify(u));
  };

  const login = data => {
    // data: { token, userId, name, surname, phone, birthday, role }
    const u = {
      id:       data.userId,
      name:     data.name,
      surname:  data.surname,
      phone:    data.phone,
      birthday: data.birthday,
      email:    data.email,
      role:     data.role,
      token:    data.token
    };
    persist(u);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gooddeedsUser");
  };

  // Новый метод: подгрузить из API все поля профиля (points, level, events,…)
  const refreshProfile = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // res.data содержит всю схему User (points, level, achievements, events,…)
      const u = { ...user, ...res.data };
      persist(u);
    } catch (err) {
      console.error("Refresh profile failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
