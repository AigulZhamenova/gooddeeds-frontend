// src/components/Donation.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Donation = () => {
  const [organizations, setOrganizations] = useState([]);
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('/api/donations'); // Замените на соответствующий API
        setOrganizations(response.data);
      } catch (error) {
        console.error("Ошибка при получении организаций:", error);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Донаты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map(org => (
          <div key={org._id} className="border p-4 rounded shadow">
            <h3 className="text-xl">{org.name}</h3>
            <p>{org.description}</p>
            <button className="bg-blue-500 text-white p-2 rounded">Пожертвовать</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Donation;
