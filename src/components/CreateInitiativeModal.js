import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { API_URL } from "../config";

export default function CreateInitiativeModal({ isOpen, onClose, onCreated }) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: ""
  });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline
      };

      const res = await axios.post(
        `${API_URL}/api/initiatives`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Ошибка создания сбора — response:", err.response);
      setError(err.response?.data?.message || "Ошибка при создании");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-xl z-[1001]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >✕</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Новый сбор</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title" value={form.title} onChange={handleChange}
            required placeholder="Название"
            className="w-full border rounded p-2"
          />
          <textarea
            name="description" value={form.description} onChange={handleChange}
            required placeholder="Описание"
            className="w-full border rounded p-2"
          />
          <div className="flex space-x-2">
            <input
              type="number" name="targetAmount"
              value={form.targetAmount} onChange={handleChange}
              required placeholder="Целевая сумма"
              className="border rounded p-2 flex-1"
            />
            <input
              type="date" name="deadline"
              value={form.deadline} onChange={handleChange}
              required className="border rounded p-2 flex-1"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Создать сбор
          </button>
        </form>
      </div>
    </div>
  );
}
