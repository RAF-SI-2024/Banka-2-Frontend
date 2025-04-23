import axios from "axios";
import {API_BASE, API_EXCHANGE} from "../constants/endpoints.ts";
import {globalLogout} from "@/types/bank_user/auth.ts";

const api_bank_user = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

const api_exchange = axios.create({
    baseURL: API_EXCHANGE,
    headers: { "Content-Type": "application/json" },
})

// Function to dynamically set or remove the Authorization token
export const setAuthToken = (token: string | null) => {
    if (token) {
        api_exchange.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        api_bank_user.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api_exchange.defaults.headers.common["Authorization"];
        delete api_bank_user.defaults.headers.common["Authorization"];
    }
};

// Axios Interceptor to attach JWT token dynamically (except for login/register)
api_exchange.interceptors.request.use(
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

api_exchange.interceptors.response.use(
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


// Axios Interceptor to attach JWT token dynamically (except for login/register)
api_bank_user.interceptors.request.use(
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

api_bank_user.interceptors.response.use(
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
export {api_bank_user, api_exchange};
