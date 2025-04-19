// src/components/FilterBar.jsx
import React from "react";

const categories = [
  { value: "", label: "Все категории" },
  { value: "экология", label: "Экология" },
  { value: "дети", label: "Помощь детям" },
  { value: "пожилые", label: "Поддержка пожилых" },
  { value: "животные", label: "Помощь животным" },
  { value: "образование", label: "Образование" },
  { value: "здравоохранение", label: "Здравоохранение" },
  { value: "гуманитарная помощь", label: "Гуманитарная помощь" },
  { value: "культура", label: "Культура" }
];

const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="mb-6 flex items-center space-x-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded p-2"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
