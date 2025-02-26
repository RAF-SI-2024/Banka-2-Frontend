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


export const updateClient = async (data: any) => {
    try {
        const response = await api.put(`${API_BASE}/clients`, data);
        return { 
            success: true, 
            data: response.data 
        };
    } catch (error) {
        console.error("❌ Failed to update client:", error);
        throw error;
    }
};

export const updateEmployee = async (data: any) => {
    try {
        const response = await api.put(`${API_BASE}/employees`, data);
        return { 
            success: true, 
            data: response.data 
        };
    } catch (error) {
        console.error("❌ Failed to update employee:", error);
        throw error;
    }
};