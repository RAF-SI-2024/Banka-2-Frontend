import { Routes, Route, Navigate } from "react-router-dom";
import ResetPassReqPage from "@/pages/auth/ResetPassRequest.tsx";
import ResetPassPage from "@/pages/auth/ResetPassword.tsx";
import ResetPasswordNotificationPage from "@/pages/auth/ResetPassNotification.tsx";
import TestPage from "@/pages/auth/Activate.tsx"
import AuthorizationLayout from "@/layouts/AuthorizationLayout.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import LoginPage from "@/pages/auth/Login.tsx";
import {
    AllProtectedRoutes,
    ProtectedLoggedUser,
    ProtectedEmployee,
    ProtectedClient, ProtectedAdmin, ProtectedAdminOrEmployee,
} from "@/router/utils/ProtectedRoutes.tsx";
import BankAccountPage from "@/pages/bank-accounts-client/BankAccount.tsx";
import RoleBasedHomePage from "@/pages/home/RoleBasedHome.tsx";
import CardDetailsPage from "@/pages/cards/BankCard.tsx";
import TransactionsOverviewPage from "@/pages/payments/TransactionsOverview.tsx";
import TransfersPage from "@/pages/payments/TransferPage.tsx";
import LoanRequestList from "@/pages/loans-employee/LoanRequestList.tsx";
import NewLoanRequest from "@/pages/loans-client/NewLoanRequest.tsx";
import ClientList from "@/pages/client-list/ClientList.tsx";
import AllLoanList from "@/pages/loans-employee/AllLoanList.tsx";
import LoanDetailsClientPage from "@/pages/loans-client/LoanDetailsClient.tsx";
import LoanOverviewList from "@/pages/loans-client/LoanOverviewList.tsx";
import NewPaymentPage from "@/pages/payments/NewPayment.tsx";
import ExchangeRateListPage from "@/pages/payments/ExchangeRateList.tsx";
import BankAccountListPage from "@/pages/bank-accounts-employee/BankAccountList.tsx";
import ActuaryListPage from "@/pages/actuary/ActuaryListPage";
import Trading from "@/pages/trading/Trading.tsx";
import SecurityLayout from "@/layouts/SecurityLayout.tsx";
import OrdersPage from "@/pages/orders-list/OrdersList.tsx"
import TaxPage from "@/pages/tax/TaxPage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route element={<AllProtectedRoutes />}>

                    <Route path="/home" element={<RoleBasedHomePage />} />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/bank-account/:accountId" element={<BankAccountPage />} />

                    <Route path="/payments/overview" element={<TransactionsOverviewPage />} />

                    <Route path="/card/:cardId" element={<CardDetailsPage />} />

                    {/*protected client routes*/}
                    <Route element={<ProtectedClient />}>
                        <Route path="/bank-account/:accountId" element={<BankAccountPage />} />
                        <Route path="/card/:cardId" element={<CardDetailsPage />} />
                        <Route path="/payments/transfer" element={<TransfersPage />}/>
                        <Route path="/payments/new" element={<NewPaymentPage />} />    
                        <Route path="/loan/new" element={<NewLoanRequest />} />
                        <Route path="/loan/overview" element={<LoanOverviewList />} />
                        <Route path="loan/overview/:loanId" element={<LoanDetailsClientPage />} />
                        <Route path="payments/exchange-rate" element={<ExchangeRateListPage />} />
                    </Route>

                    <Route element={<ProtectedAdminOrEmployee />}>
                        <Route path="loan/request" element={ <LoanRequestList />} />
                        <Route path="bank-account-list" element={<BankAccountListPage />} />
                        <Route path="loan/all" element={<AllLoanList />} />
                        <Route path="/order/overview" element={<OrdersPage />} />
                        <Route path="actuary/overview" element={<ActuaryListPage />} />
                        <Route path="tax/overview" element={<TaxPage />} />
                    </Route>

                    <Route element={<ProtectedEmployee />}>
                        <Route path="bank-account-list" element={<ClientList />} />
                    </Route>

                </Route>
            </Route>

            <Route element={<SecurityLayout />}>
                <Route element={<AllProtectedRoutes />}>
                    <Route path="trading" element={<Trading />} />
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

            {/* Catch-all route for non-existing paths */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    )
}