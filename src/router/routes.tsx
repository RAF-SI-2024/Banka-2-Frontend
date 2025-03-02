import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/Home";
import ComponentShowcasePage from "@/pages/ComponentShowcase";
import UserListPage from "@/pages/UserList.tsx";
import ResetPassReqPage from "@/pages/ResetPassRequest.tsx";
import ResetPassPage from "@/pages/ResetPassword.tsx";
import ResetPasswordNotificationPage from "@/pages/ResetPassNotification";
import RegisterPage from "@/pages/Register"
import TestPage from "@/pages/Activate.tsx"
import AuthorizationLayout from "@/layouts/AuthorizationLayout.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import LoginPage from "@/pages/Login.tsx";


export const AppRoutes = () => {
  return (
    <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/user-list" element={<UserListPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/showcase" element={<ComponentShowcasePage />} />
        </Route>

        <Route element={<AuthorizationLayout />}>
            <Route path="/activate" element={<TestPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resetpass-nzm" element={<ResetPassPage />} /> {/*TODO: CHANGE ROUTE */}
            <Route path="/password-reset" element={<ResetPassReqPage />} />
            <Route path="/resetNotification" element={<ResetPasswordNotificationPage />}/>
        </Route>
    </Routes>
  )
}