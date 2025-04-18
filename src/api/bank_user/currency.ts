import {api_bank_user} from "../axios.ts"
import {API_BASE} from "@/constants/endpoints.ts";

export const getAllCurrencies = async () => {
    try {
        const response = await api_bank_user.get("/currencies");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching currencies:", error);
        throw error;
    }
}

export const getCurrencyById = async (currencyId: string) => {
    try{
        const response = await api_bank_user.get(`${API_BASE}/currencies/${currencyId}`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching currency:", error);
        throw error;
    }
}

export const getExchangeRate = async (currencyFromCode: string, currencyToCode: string) => {
    try {
        const response = await api_bank_user.get("/exchanges/currencies", {
            params: {
                currencyFromCode: currencyFromCode,
                currencyToCode: currencyToCode
            },
            headers: {
                "Accept": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        throw error;
    }
};