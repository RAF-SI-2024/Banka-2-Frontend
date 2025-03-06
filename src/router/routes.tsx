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
import {
    AdminProtectedRoutes,
    AllProtectedRoutes,
    ClientHomePageGuard, EmployeeHomePageGuard,
    ProtectedLoggedUser
} from "@/router/utils/ProtectedRoutes.tsx";
import BankAccountPage from "@/pages/BankAccount.tsx";
import CreateAccountPage from "@/pages/CreateAccountPage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route element={<AdminProtectedRoutes />}>
                    <Route path="/home" element={<UserListPage />} />
                </Route>
                <Route element={<AllProtectedRoutes />}>
                    <Route element={<ClientHomePageGuard />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route element={<EmployeeHomePageGuard />}>
                        <Route path="/home" element={<ComponentShowcasePage />} /> {/*TODO: CHANGE ELEMENT COMPONENT TO EMPLOYEE HOME PAGE */}
                    </Route>
                    <Route element={<ClientHomePageGuard />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/bank-account/:accountId" element={<BankAccountPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/create-account" element={<CreateAccountPage />} />
                </Route>
            </Route>

            <Route element={<AuthorizationLayout />}>
                <Route element={<ProtectedLoggedUser />}>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/activate" element={<TestPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/reset-password" element={<ResetPassPage />} />
                    <Route path="/password-reset" element={<ResetPassReqPage />} />
                    <Route path="/resetNotification" element={<ResetPasswordNotificationPage />} />
                </Route>
            </Route>
        </Routes>
    )
}