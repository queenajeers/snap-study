import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Navbar from "./components/Navbar";
import Protected from "./pages/Protected";
import { AuthProvider } from "./contexts/AuthContext";
import StudyNoteBookView from "./pages/StudyNoteBookView";

function Layout() {
  return (
    <div className="font-noto min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div> */}
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "plans", element: <Plans /> },
      { path: "app", element: <Protected /> },
      { path: "view/:id", element: <StudyNoteBookView /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
