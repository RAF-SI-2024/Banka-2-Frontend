import api from "@/api/axios.ts";
import { ExchangeTableDataResponse} from "@/types/exchange.ts";


export const getAllExchanges = async (
    page: number,
    size: number,
    filters: { search?: string; country?: string;}
): Promise<ExchangeTableDataResponse> => {
    try {
        const response = await api.get("/exchanges", {
            params: {
                search: filters.search || undefined,
                country: filters.country || undefined,
                page,
                size,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
} 

export const getAllExchangeCountries = async (): Promise<string[]> => {
    try {
        const response = await api.get("/exchange/countries");
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
} 