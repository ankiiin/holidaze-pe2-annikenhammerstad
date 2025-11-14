import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    window.addEventListener("storage", syncLoginStatus);
    return () => window.removeEventListener("storage", syncLoginStatus);
  }, []);

  function syncLoginStatus() {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-orange-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-serif text-xl font-bold text-coral tracking-wide">
            HOLIDAZE
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-teal font-medium hover:text-coral transition ${
                isActive ? "text-coral" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/venues"
            className={({ isActive }) =>
              `text-teal font-medium hover:text-coral transition ${
                isActive ? "text-coral" : ""
              }`
            }
          >
            Explore
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-teal font-medium hover:text-coral transition ${
                    isActive ? "text-coral" : ""
                  }`
                }
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="bg-coral text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-500 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-teal font-medium hover:text-coral transition ${
                    isActive ? "text-coral font-semibold" : ""
                  }`
                }
              >
                Profile
              </NavLink>

              {/* 🔥 Coral Log Out button */}
              <button
                onClick={handleLogout}
                className="bg-coral text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-500 transition"
              >
                Log Out
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
        >
          <span className="w-6 h-0.5 bg-teal"></span>
          <span className="w-6 h-0.5 bg-teal"></span>
          <span className="w-6 h-0.5 bg-teal"></span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-4">

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-teal font-medium hover:text-coral transition"
            >
              Home
            </NavLink>

            <NavLink
              to="/venues"
              onClick={() => setMenuOpen(false)}
              className="text-teal font-medium hover:text-coral transition"
            >
              Explore
            </NavLink>

            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-teal font-medium hover:text-coral transition"
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-coral text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-500 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-teal font-medium hover:text-coral transition"
                >
                  Profile
                </NavLink>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-coral text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-500 transition"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;