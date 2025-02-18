import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Cookies from "js-cookie";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isdarkmode, setIsdarkmode] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setIsdarkmode(Cookies.get("mode") === "light");
  }, []);

  const toggleDarkMode = () => {
    const newMode = isdarkmode ? "dark" : "light";
    setIsdarkmode(!isdarkmode);
    document.body.className = `${newMode}-mode`;
    Cookies.set("mode", newMode, { expires: 10 });
  };

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      ["email", "token", "username"].forEach((cookie) =>
        Cookies.remove(cookie)
      );
      history.push("/");
    }
  };

  return (
    <div
      id="sidebar"
      style={{ borderRadius: 0, height: "100vh" }}
      className={`lg:w-16 lg:flex ${
        isSidebarOpen ? "lg:w-64" : ""
      } fixed lg:h-screen overflow-y-auto text-gray-400 transition-all duration-300`}
    >
      <div className="flex flex-col items-center w-16 lg:w-64 h-full overflow-hidden text-gray-400">
        {/* Logo */}
        <a className="flex items-center justify-center mt-3" href="#">
          <svg
            className="w-8 h-8 fill-current"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </a>

        {/* Dark Mode Toggle */}
        <button
          className="flex items-center justify-center mt-3"
          onClick={toggleDarkMode}
        >
          <div
            className={`w-10 h-5 bg-gray-300 p-1 ${
              isdarkmode ? "" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 shadow-md transform ${
                isdarkmode ? "translate-x-5" : ""
              }`}
            />
          </div>
        </button>

        {/* Sidebar Links */}
        <div className="flex flex-col items-center mt-3 border-t border-gray-700">
          {[
            "/dashboard",
            "/manage-users",
            "/manage-admins",
            "/categories",
            "/manage-jobs",
          ].map((path, index) => (
            <Link
              key={index}
              className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
                isActiveLink(path)
                  ? "bg-gray-500 text-gray-300"
                  : "hover:bg-gray-700 hover:text-gray-300"
              }`}
              to={path}
            >
              <i
                className={
                  [
                    "fas fa-home",
                    "fas fa-user-friends",
                    "fas fa-layer-group",
                    "fas fa-clipboard-list",
                    "fas fa-briefcase",
                  ][index]
                }
              ></i>
            </Link>
          ))}
        </div>

        {/* Additional Links */}
        <div className="flex flex-col items-center mt-2">
          {["/reports", "/customer-support"].map((path, index) => (
            <Link
              key={index}
              className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
                isActiveLink(path)
                  ? "bg-gray-500 text-gray-300"
                  : "hover:bg-gray-700 hover:text-gray-300"
              }`}
              to={path}
            >
              <i
                className={index === 0 ? "fas fa-chart-pie" : "fas fa-headset"}
              ></i>
            </Link>
          ))}

          <button
            className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>

        {/* Footer Link */}
        <Link
          className={`flex items-center justify-center w-16 h-16 mt-auto ${
            isActiveLink("/my-accounts")
              ? "bg-gray-500 text-gray-300"
              : "hover:bg-gray-700 hover:text-gray-300"
          }`}
          to="/my-accounts"
        >
          <i className="fas fa-user-circle fa-lg"></i>
        </Link>
      </div>
    </div>
  );
}
