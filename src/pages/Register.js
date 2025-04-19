// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../contexts/AuthContext";

const Register = () => {
  const [name, setName]         = useState("");
  const [surname, setSurname]   = useState("");
  const [phone, setPhone]       = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const { login }               = useContext(AuthContext);
  const navigate                 = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // создаём пользователя
      await axios.post(`${API_URL}/api/auth/register`, {
        name, surname, phone, birthday, email, password, role: "user"
      });
      // сразу логинимся
      const res2 = await axios.post(`${API_URL}/api/auth/login`, {
        email, password
      });
      const data = res2.data;
      login({
        userId:   data.userId,
        token:    data.token,
        role:     data.role,
        name:     data.name,
        surname:  data.surname,
        email:    data.email,
        phone:    data.phone,
        birthday: data.birthday
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={surname}
          onChange={e => setSurname(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border rounded p-2"
        />
        <label className="block text-gray-600">Дата рождения:</label>
        <input
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Зарегистрироваться
        </button>
      </form>
      <p className="mt-4 text-center">
        Уже есть аккаунт?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Войти
        </a>
      </p>
    </div>
  );
};

export default Register;
