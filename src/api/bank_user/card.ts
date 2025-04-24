import {api_bank_user} from "@/api/axios.ts";
import {CardCreateRequest, CardUpdateLimitRequest} from "@/types/bank_user/card.ts";

export const getCardById = async (id:string) => {
    try {
        const response = await api_bank_user.get(`/cards/${id}`);
        return response;
    } catch (error) {
        console.error("Failed to get card! :", error);
        throw error;
    }
}

export const changeCardStatusClient = async (cardId: string, status: boolean) => {
    try {
        const response = await api_bank_user.put(`/cards/${cardId}/status`, {
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
        const response = await api_bank_user.put(`/cards/${id}/status`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("Failed to get card! :", error);
        throw error;
    }
}


export const createCard = async (data: CardCreateRequest) => {
    try {
        const response = await api_bank_user.post("/cards", data);

        return response;
    } catch (error) {
        console.error("❌ Failed to create card:", error);
        throw error;
    }
};

export const getAllCardsForClient = async (clientId: string) => {
    try {
        const response = await api_bank_user.get(`clients/${clientId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get cards for client:", error);
        throw error;
    }
}

export const editCardLimit = async (cardId: string, data: CardUpdateLimitRequest) => {
    try {
        const response = await api_bank_user.put(`/cards/${cardId}/limit`, data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to edit limit for the client:", error);
        throw error;
    }
}