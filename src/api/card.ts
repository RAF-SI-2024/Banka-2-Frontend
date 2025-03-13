import api from "@/api/axios.ts";
import {API_BASE} from "@/constants/endpoints.ts";

export const getCardById = async (id:string) => {
    try {
        const response = await api.get(`${API_BASE}/cards/${id}`);
        return response;
    } catch (error) {
        console.error("Failed to get card! :", error);
        throw error;
    }
}

export const changeCardStatusClient = async (id: string, status: boolean) => {
    try {
        const response = await api.put(`${API_BASE}/cards/${id}/client`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("Failed to get card! :", error);
        throw error;
    }
}

export const changeCardStatusEmployee = async (id: string, status: boolean) => {
    try {
        const response = await api.put(`${API_BASE}/cards/${id}/employee`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("Failed to get card! :", error);
        throw error;
    }
}