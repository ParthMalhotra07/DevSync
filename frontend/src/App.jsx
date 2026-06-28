import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Organizations from "./pages/Organizations.jsx";
import Teams from "./pages/Teams.jsx";
import TeamDetail from "./pages/TeamDetail.jsx";
import ProjectBoard from "./pages/ProjectBoard.jsx";
import { Toaster } from "react-hot-toast";

// Dashboard Placeholder
const Dashboard = () => <div>Welcome to DevSync Dashboard</div>;

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="projects/:id" element={<ProjectBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
