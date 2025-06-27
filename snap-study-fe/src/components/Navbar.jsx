import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClasses = "relative pb-1"; // Padding for gap
  const activeLinkClasses =
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-black";

  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-white text-black">
      {/* Logo */}
      <div className="text-xl font-bold">
        <NavLink to="/">
          <img className="w-28" src="/SnapStudyLogo.png" alt="SnapStudy Logo" />
        </NavLink>
      </div>

      {/* Menu Buttons */}
      <div className="space-x-12 hidden md:flex">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
          }
        >
          About
        </NavLink>
        <NavLink
          to="/items"
          className={({ isActive }) =>
            isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
          }
        >
          Items
        </NavLink>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button className="text-white">☰</button>
      </div>
    </nav>
  );
}

export default Navbar;
