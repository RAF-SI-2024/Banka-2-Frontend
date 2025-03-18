import { Routes, Route, Navigate } from "react-router-dom";
import ResetPassReqPage from "@/pages/ResetPassRequest.tsx";
import ResetPassPage from "@/pages/ResetPassword.tsx";
import ResetPasswordNotificationPage from "@/pages/ResetPassNotification";
import TestPage from "@/pages/Activate.tsx"
import AuthorizationLayout from "@/layouts/AuthorizationLayout.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import LoginPage from "@/pages/Login.tsx";
import {
    AllProtectedRoutes,
    ProtectedLoggedUser,
    ProtectedEmployee,
} from "@/router/utils/ProtectedRoutes.tsx";
import BankAccountPage from "@/pages/BankAccount.tsx";
import RoleBasedHomePage from "@/pages/RoleBasedHome.tsx";
import CardDetailsPage from "@/pages/BankCard.tsx";
import LoanRequestList from "@/pages/LoanRequestList";
import NewLoanRequest from "@/pages/NewLoanRequest.tsx";
import ClientList from "@/pages/ClientList.tsx";
import AllLoanList from "@/pages/AllLoanList";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route element={<AllProtectedRoutes />}>

                    <Route path="/home" element={<RoleBasedHomePage />} />

                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/bank-account/:accountId" element={<BankAccountPage />} />
                    <Route path="/card/:cardId" element={<CardDetailsPage />} />
                    <Route path="/loan/new" element={<NewLoanRequest />} />

                    {/*protected employee routes*/}

                    <Route element={<ProtectedEmployee />}>
                        <Route path="loan/request" element={ <LoanRequestList />} />
                        <Route path="client-list" element={<ClientList />} />
                        <Route path="loan/all" element={<AllLoanList />} />

                    </Route>

                </Route>
            </Route>

            <Route element={<AuthorizationLayout />}>
                <Route element={<ProtectedLoggedUser />}>
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