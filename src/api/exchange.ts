import {LoanTypeResponse} from "@/types/loanType.ts";
import api from "@/api/axios.ts";

export const getAllExchangeCurrencies = async (
    currencyFromCode: string,
    currencyToCode: string,
): Promise<LoanTypeResponse> => {
    try {
        const response = await api.get("/loans/types", {
            params: {

            },
        });

        return response.data; // API returns an array of loan types
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};