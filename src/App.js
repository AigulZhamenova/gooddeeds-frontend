import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/ProfilePage";
import DonationPage from "./pages/DonationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import InitiativePage from "./pages/InitiativePage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/initiative/:id" element={<InitiativePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/donations" element={<DonationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
