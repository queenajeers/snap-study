import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Protected from "./pages/Protected";
import { AuthProvider } from "./contexts/AuthContext";
import StudyMaterialView from "./pages/StudyMaterialView";

function Layout() {
  return (
    <div className="font-noto min-h-screen">
      <Header />
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
    children: [{ index: true, element: <Protected /> }],
  },
  { path: "/studymaterial/:id", element: <StudyMaterialView /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
