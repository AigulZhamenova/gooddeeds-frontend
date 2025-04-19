// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../contexts/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      const data = res.data;
      if (data.token) {
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
      } else {
        alert("Ошибка входа");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Вход</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
            placeholder="you@example.com"
          />
        </div>
        <div className="relative">
          <label className="block mb-1 font-medium">Пароль</label>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring pr-10"
            placeholder="••••••••"
          />
         <button
           type="button"
           onClick={() => setShowPass(v => !v)}
           className="absolute top-9 right-3 text-gray-500 hover:text-gray-800"
         >
           {showPass ? <FiEyeOff /> : <FiEye />}
         </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Войти
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};

export default Login;
