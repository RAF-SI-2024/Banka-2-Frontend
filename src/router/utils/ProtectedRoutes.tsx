import { Outlet, Navigate } from "react-router-dom";

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