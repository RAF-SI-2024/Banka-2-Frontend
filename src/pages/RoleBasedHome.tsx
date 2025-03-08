import {  Role } from "@/types/enums.ts";
import UserListPage from "@/pages/UserList.tsx";
import LoginPage from "@/pages/Login.tsx";
import BankAccountListPage from "@/pages/BankAccountList.tsx";
import HomePage from "@/pages/Home.tsx";

export const RoleBasedHomePage = () => {

    const user = sessionStorage.getItem("user");
    let role = Role.Invalid;

    if (user !== null)
        role = JSON.parse(user).role;


    switch (role) {
        case Role.Admin:
            return <UserListPage />;
        case Role.Employee:
            return <BankAccountListPage />;
        case Role.Client:
            return <HomePage />;
        default:
            return <LoginPage />;
    }
};

export default RoleBasedHomePage;
