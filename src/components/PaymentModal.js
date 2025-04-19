// src/components/PaymentModal.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function PaymentModal({ isOpen, onClose, amount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      // 1) Создаём Checkout Session на вашем сервере
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-checkout-session`,
        { amount },
      );

      // 2) Загружаем Stripe.js
      const stripe = await stripePromise;
      // 3) Перенаправляем на Checkout
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Не удалось инициировать платёж");
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Фон затемнения */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Модалка */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm shadow-lg z-60">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Оплатить {amount}₸
        </h2>

        {error && (
          <p className="mb-2 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Переход..." : `Оплатить ${amount}₸`}
        </button>
      </div>
    </div>
  );
}
