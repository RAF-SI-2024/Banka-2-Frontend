import { Outlet, Navigate } from "react-router-dom";
import {  Role } from "@/types/enums.ts";

export const AllProtectedRoutes = () => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (user == null)
        return <Navigate to="/login" replace/>

    const role = JSON.parse(user).role;

    return  token != null &&  role != null? <Outlet/> : <Navigate to="/login" replace/>
}


export const ProtectedLoggedUser = () => {
    const token = sessionStorage.getItem("token");
    return  token == null ? <Outlet/> : <Navigate to="/home" replace/>
}

export const ProtectedEmployee = () => {
    const user = sessionStorage.getItem("user");
    if (user == null)
        return <Navigate to="/login" replace/>

    const role = JSON.parse(user).role;
    return role === Role.Employee ? <Outlet/> : <Navigate to="/home" replace/>
}


export const ProtectedAdmin = () => {
    const user = sessionStorage.getItem("user");
    if (user == null)
        return <Navigate to="/login" replace/>

    const role = JSON.parse(user).role;
    return role === Role.Admin ? <Outlet/> : <Navigate to="/home" replace/>
}

export const ProtectedAdminOrEmployee = () => {
    const user = sessionStorage.getItem("user");
    if (user == null)
        return <Navigate to="/login" replace/>

    const role = JSON.parse(user).role;
    return role === Role.Admin || role === Role.Employee ? <Outlet/> : <Navigate to="/home" replace/>
}


export const ProtectedClient = () => {
    const user = sessionStorage.getItem("user");
    if (user == null)
        return <Navigate to="/login" replace/>

    const role = JSON.parse(user).role;
    return role === Role.Client ? <Outlet/> : <Navigate to="/home" replace/>
}