import {LoanTypeResponse} from "@/types/loan-type.ts";
import api from "@/api/axios.ts";
import {Exchange} from "@/types/exchange.ts";


export const getAllExchanges = async (
): Promise<Exchange[]> => {
    try {
        const response = await api.get("/exchanges", {});
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching exchanges:", error);
        throw error;
    }
}