import axios from "axios";
import { API_BASE } from "../constants/endpoints";

// Create an Axios instance with the base API URL
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
        const token = localStorage.getItem("token");
        if (token && !config.url?.includes("/users/login") && !config.url?.includes("/users/register")) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
