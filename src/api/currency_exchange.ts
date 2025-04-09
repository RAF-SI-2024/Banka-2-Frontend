import {CurrencyExchange} from "@/types/currency_exchange.ts";
import api from "@/api/axios.ts";

export const getAllCurrencyExchanges = async (
): Promise<CurrencyExchange[]> => {
    try {
        const response = await api.get("/exchanges", {});
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
}