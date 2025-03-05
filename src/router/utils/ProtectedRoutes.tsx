import { Outlet, Navigate } from "react-router-dom";
import {getRoleNumber, Role} from "@/types/enums.ts";

export const AdminProtectedRoutes = () => {
    const user = sessionStorage.getItem("user");
    if (user == null)
        return <Navigate to="/login"/>
    const token = sessionStorage.getItem("token");
    const isAdmin = JSON.parse(user).role;
    return isAdmin == Role.Admin && token != null ? <Outlet/> : <Navigate to="/home" replace/>
}

export const AllProtectedRoutes = () => {
    const token = sessionStorage.getItem("token");
    return  token != null ? <Outlet/> : <Navigate to="/login" replace/>
}


export const ProtectedLoggedUser = () => {
    const token = sessionStorage.getItem("token");
    return  token == null ? <Outlet/> : <Navigate to="/home" replace/>
}