import api from "./axios";
import { API_BASE } from "../constants/endpoints";
import { LoginRequest } from "../types/auth";

export const loginUser = async (data: LoginRequest) => {
    try {
        const response = await api.post(`${API_BASE}/users/login`, data);
        return response.data; // Returns token or user data
    } catch (error) {
        console.error("❌ Login failed:", error);
        throw error;
    }
};
