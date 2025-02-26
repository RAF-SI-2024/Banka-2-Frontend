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


export const getAllUsers = async (page: number, pageSize: number, search: { email: string, firstName: string, lastName: string, role: string }) => {
    try {
        const response = await api.get(`${API_BASE}/users`, {
            params: {
                page: page,
                pageSize: pageSize,
                email: search.email,
                firstName: search.firstName,
                lastName: search.lastName,
                role: search.role,
            },
        });

        return Array.isArray(response.data.data) ? response.data.data : response.data;
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};