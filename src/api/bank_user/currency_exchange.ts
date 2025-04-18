import {CurrencyExchange} from "@/types/bank_user/currency_exchange.ts";
import {api_bank_user} from "@/api/axios.ts";

export const getAllCurrencyExchanges = async (
): Promise<CurrencyExchange[]> => {
    try {
        const response = await api_bank_user.get("/exchanges", {});
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
}