import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import ComponentShowcasePage from "@/pages/ComponentShowcase";
import UserListPage from "@/pages/UserList.tsx";
import ResetPassReqPage from "@/pages/ResetPassRequest.tsx";
import ResetPassPage from "@/pages/ResetPassword.tsx";
import ResetPasswordNotificationPage from "@/pages/ResetPassNotification";
import { Routes, Route, Navigate } from "react-router-dom"
import EditUserPage from "@/pages/EditUser"
import RegisterPage from "@/pages/Register"
import TestPage from "@/pages/Test"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Field for activating account*/}
      <Route path="/activate" element={<TestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/userlist" element={<UserListPage />} />
      <Route path="/edituser" element={<EditUserPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/resetpassreq" element={<ResetPassReqPage />} />
      <Route path="/resetpass" element={<ResetPassPage />} />
      <Route path="/resetNotification" element={<ResetPasswordNotificationPage />}/>
      <Route path="/showcase" element={<ComponentShowcasePage />} />
    </Routes>
  )
}

export default AppRoutes

