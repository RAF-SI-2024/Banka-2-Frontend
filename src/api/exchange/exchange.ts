import {api_bank_user, api_exchange} from "@/api/axios.ts";
import { ExchangeResponse} from "@/types/exchange/exchange.ts";


export const getAllExchanges = async (
    page: number,
    size: number,
    filters?: { name?: string; polity?: string;}
): Promise<ExchangeResponse> => {
    try {
        const response = await api_exchange.get("/exchanges", {
            params: {
                name: filters?.name || undefined,
                polity: filters?.polity || undefined,
                page,
                size,
            },
        });
        console.log("ALO BRE" + response.data);
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
} 

export const getAllExchangeCountries = async (): Promise<string[]> => {
    try {
        const response = await api_bank_user.get("/exchange/countries");
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
} 