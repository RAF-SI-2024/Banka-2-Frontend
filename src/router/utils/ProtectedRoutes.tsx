import { Outlet, Navigate } from "react-router-dom";
import {getRoleNumber, Role} from "@/types/enums.ts";

export const AdminProtectedRoutes = () => {
    const userRole = sessionStorage.getItem("role");
    if (userRole == null)
        return <Navigate to="/home"/>
    const ifAdmin = getRoleNumber(userRole)
    return ifAdmin == Role.Admin ? <Outlet/> : <Navigate to="/home"/>
}

export const AllProtectedRoutes = () => {
    const userId = sessionStorage.getItem("id");
    const userRole = sessionStorage.getItem("role");
    return userRole != null && userId != null ? <Outlet/> : <Navigate to="/login"/>
}