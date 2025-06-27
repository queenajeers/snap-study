import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Plans from "./pages/Plans";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <div className="font-noto">
      <Navbar />
      <main className="p-4">
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
      { path: "about", element: <About /> },
      { path: "items", element: <Plans /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
