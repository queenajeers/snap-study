import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Home from "./Home";
import Topics from "./Topics";

export default function Protected() {
  const { user } = useAuth();
  return user ? <Topics /> : <Home />;
}
