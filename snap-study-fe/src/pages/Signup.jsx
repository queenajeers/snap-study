import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { login } = useAuth();

  const loginClicked = () => {
    login("sreeja");
    console.log("LOGIN CLIKED");
  };
  return (
    <div className="z-100">
      <button
        className="p-4 border-2 bg-blue-200 cursor-pointer"
        onClick={loginClicked}
      >
        Login
      </button>
    </div>
  );
}
