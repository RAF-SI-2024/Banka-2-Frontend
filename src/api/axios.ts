import axios from "axios";
import { API_BASE } from "../constants/endpoints";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {globalLogout} from "@/types/auth.ts";

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

api.interceptors.response.use(
    (response) => response, // If response is successful, return it
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {

            if (typeof globalLogout === "function") {
                globalLogout(); // Call the globally stored logout function
            }
        }
        return Promise.reject(error);
    }
);
export default api;
