import React from "react";
import { useAuth } from "../contexts/AuthContext";
import logo from "/SnapStudyLogo.png";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img width={110} src={logo} alt="SnapStudy Logo" />
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <button
              onClick={logout}
              className="bg-[#da453a] text-white  px-4 py-2 rounded hover:bg-[#c12f39] transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
