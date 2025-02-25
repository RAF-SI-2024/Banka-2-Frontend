import api from "./axios";
import { API_BASE } from "../constants/endpoints";
import { LoginRequest } from "../types/auth";

export const getUserById = async (id: number) => {
    try {
        const response = await api.get(`${API_BASE}/users/${id}`);
        return response.data; // Returns user data
    } catch (error) {
        console.error("❌ Failed to fetch user:", error);
        throw error;
    }
};


// update user by id 
export const updateUser = async (id: number, data: any) => {
    try {
        const response = await api.put(`${API_BASE}/users/${id}`, data);
        return response.data; // Returns updated user data
    } catch (error) {
        console.error("❌ Failed to update user:", error);
        throw error;
    }
};