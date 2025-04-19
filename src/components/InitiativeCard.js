// src/components/InitiativeCard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function InitiativeCard({ init, onDonate }) {
  const { user } = useContext(AuthContext);

  const handleDonate = () => {
    // если не залогинен или обычный юзер — показываем логин‑модалку
    if (!user || user.role === "user") {
      return onDonate(null);
    }
    // если админ — сразу открываем платежный модал
    onDonate(init);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 flex justify-between items-center">
      <Link
        to={`/initiative/${init._id}`}
        className="text-xl font-semibold text-blue-600 hover:underline flex-1"
      >
        {init.title}
      </Link>
      <span className="mx-4 text-gray-700">
        {init.raisedAmount}₸ / {init.targetAmount}₸
      </span>
      <button
        onClick={handleDonate}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
      >
        Сделать Донат
      </button>
    </div>
  );
}
