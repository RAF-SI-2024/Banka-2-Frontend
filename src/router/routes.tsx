import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import ComponentShowcasePage from "@/pages/ComponentShowcase";
import ResetPassReqPage from "@/pages/ResetPassRequest.tsx";
import ResetPassPage from "@/pages/ResetPassword.tsx";
import ResetPasswordNotificationPage from "@/pages/ResetPassNotification";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root path to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<HomePage />} />{" "}
      {/* TODO: change to register page */}
      <Route path="/showcase" element={<ComponentShowcasePage />} />
      <Route path="/resetpassreq" element={<ResetPassReqPage />} />
      <Route path="/resetpass" element={<ResetPassPage />} />
      <Route
        path="/resetNotification"
        element={<ResetPasswordNotificationPage />}
      />
    </Routes>
  );
};

export default AppRoutes;
