// src/pages/DonationPage.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config";
import InitiativeCard from "../components/InitiativeCard";
import CreateInitiativeModal from "../components/CreateInitiativeModal";
import { AuthContext } from "../contexts/AuthContext";

export default function DonationPage() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [showCreateInitiative, setShowCreateInitiative] = useState(false);

  const loadInitiatives = () => {
    axios.get(`${API_URL}/api/initiatives`)
      .then(res => setList(res.data.initiatives || res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadInitiatives();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Сборы и пожертвования</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateInitiative(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Создать сбор
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {list.length ? (
          list.map(i => <InitiativeCard key={i._id} init={i} />)
        ) : (
          <p className="text-gray-500">Ничего не найдено.</p>
        )}
      </div>

      <CreateInitiativeModal
        isOpen={showCreateInitiative}
        onClose={() => setShowCreateInitiative(false)}
        onCreated={() => {
          setShowCreateInitiative(false);
          loadInitiatives();
        }}
      />
    </div>
  );
}
