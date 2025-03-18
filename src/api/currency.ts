import api from "./axios"
import {API_BASE} from "@/constants/endpoints.ts";

export const getAllCurrencies = async () => {
    try {
        const response = await api.get("/currencies");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching currencies:", error);
        throw error;
    }
}

export const getCurrencyById = async (currencyId: string) => {
    try{
        const response = await api.get(`${API_BASE}/currencies/${currencyId}`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching currency:", error);
        throw error;
    }
}