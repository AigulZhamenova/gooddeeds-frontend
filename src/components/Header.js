// src/components/Header.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiHeart, FiLogOut, FiUser } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef();
  const nav = useNavigate();

  // закрыть меню при клике вне
  useEffect(() => {
    const outside = e => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const onLogout = () => {
    logout();
    nav("/"); // редирект на Home
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">GoodDeeds</Link>

        <nav className="flex items-center space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-blue-500 flex items-center">
            <FiHome className="mr-1" /> Мероприятия
          </NavLink>
          <NavLink to="/donations" className="text-gray-600 hover:text-blue-500 flex items-center">
            <FiHeart className="mr-1" /> Донаты
          </NavLink>

          {user ? (
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white focus:outline-none"
                title={`${user.name} ${user.surname}`}
              >
                {user.name?.charAt(0).toUpperCase() 
                  ?? user.email?.charAt(0).toUpperCase() 
                  ?? "?"}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser className="mr-2" /> Профиль
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="text-gray-600 hover:text-blue-500 flex items-center">
              <FiUser className="mr-1" /> Вход
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
