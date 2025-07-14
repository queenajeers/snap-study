import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <button
        onClick={login}
        className="bg-[#4CC490] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3da97b] transition duration-200"
      >
        Login with Google
      </button>
    </div>
  );
}
