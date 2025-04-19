import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} GoodDeeds. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
