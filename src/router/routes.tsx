import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/Login"
import EditUserPage from "@/pages/EditUser"
import HomePage from "@/pages/Home"
import RegisterPage from "@/pages/Register"
import ComponentShowcasePage from "@/pages/ComponentShowcase"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root path to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      {/* Public Routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/edituser" element={<EditUserPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<HomePage />} />{" "}
      {/* TODO: change to register page */}
      <Route path="/showcase" element={<ComponentShowcasePage />} />
    </Routes>
  )
}

export default AppRoutes
