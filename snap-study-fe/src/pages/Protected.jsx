import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Signup from "./Signup";

export default function Protected() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Signup />;
}
