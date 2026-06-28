import React, { useState, useEffect } from "react";
import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import socket from "../utils/socket.js";
import toast from "react-hot-toast";

const MainLayout = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Setup Socket connection
    socket.connect();
    socket.emit("setup", user._id);

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.success(notification.message, {
        icon: "🔔",
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.disconnect();
    };
  }, [token, user._id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <span className="text-xl font-bold text-gray-800">DevSync</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/organizations"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Building size={20} />
              <span>Organizations</span>
            </Link>
            <Link
              to="/teams"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Users size={20} />
              <span>Teams</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full"
              >
                <div className="relative">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <span>Notifications</span>
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 font-semibold text-sm text-gray-700">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
                        >
                          {notif.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 w-full"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">Workspace</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
