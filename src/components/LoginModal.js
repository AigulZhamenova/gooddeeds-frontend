// src/components/LoginModal.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginModal({ onSuccess, onClose }) {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    dob: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email: form.email,
        password: form.password
      });
      login(data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка входа");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1) Регистрируем пользователя
      await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        surname: form.surname,
        phone: form.phone,
        birthday: form.dob,
        email: form.email,
        password: form.password
      });

      // 2) Уведомляем пользователя
      alert("✔️ Вы успешно зарегистрировались!");

      // 3) Сразу логиним
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email: form.email,
        password: form.password
      });
      login(data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl z-[1001]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>

        <form
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className="space-y-3"
        >
          {mode === "register" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Имя"
                className="w-full border rounded p-2"
              />
              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                required
                placeholder="Фамилия"
                className="w-full border rounded p-2"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Телефон"
                className="w-full border rounded p-2"
              />
              <label className="block text-sm text-gray-600">
                Дата рождения:
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border rounded p-2"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Пароль"
            className="w-full border rounded p-2"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              setMode((m) => (m === "login" ? "register" : "login"));
              setError("");
            }}
          >
            {mode === "login" ? "Зарегистрируйтесь" : "Войдите"}
          </button>
        </p>
      </div>
    </div>
  );
}
