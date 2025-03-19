import api from "@/api/axios.ts";
import {API_BASE} from "@/constants/endpoints.ts";
import {CardCreateRequest} from "@/types/card.ts";

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
        const response = await api.put(`${API_BASE}/cards/${id}/client/status`, {
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

export const getCardTypes = async () => {
    try {
        const response = await api.get("/cards/types");
        return response;
    } catch (error) {
        console.error("❌ Error fetching card types:", error);
        throw error;
    }
}

export const createCard = async (data: CardCreateRequest) => {
    try {
        const response = await api.post("/cards", data);

        return response;
    } catch (error) {
        console.error("❌ Failed to create card:", error);
        throw error;
    }
};

export const getAllCardsForClient = async (clientId: string) => {
    try {
        const response = await api.get(`${API_BASE}/clients/${clientId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get cards for client:", error);
        throw error;
    }
}