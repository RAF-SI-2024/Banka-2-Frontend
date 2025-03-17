import api from "./axios";
import { LoanResponse } from "@/types/loan";


// TODO: dodati filter po vrsti kredita kada backend zavrsi 
export const getAllLoans = async (
    page: number,
    size: number,
    filters: { accountNumber?: string; }
): Promise<LoanResponse> => {
    try {
        const response = await api.get("/loans", {
            params: {
                accountNumber: filters.accountNumber || undefined,
                page,
                size,
            },
        });

        return response.data; // API returns an array of u
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};