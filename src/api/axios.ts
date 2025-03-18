import axios from "axios";
import { API_BASE } from "../constants/endpoints";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";


const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Function to dynamically set or remove the Authorization token
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Axios Interceptor to attach JWT token dynamically (except for login/register)
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token && !config.url?.includes("/users/login") && !config.url?.includes("/users/register")) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add an interceptor to handle unauthorized responses
api.interceptors.response.use(
    (response) => response, // If response is successful, return it
    (error) => {
        console.log("STATAIS", error.response?.status);
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error("🔑 Unauthorized! Logging out...");

            // Access AuthContext to call logout function
            const authContext = useContext(AuthContext);

            if (authContext) {
                authContext.logout();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
