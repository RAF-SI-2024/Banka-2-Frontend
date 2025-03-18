import { LoanTypeResponse } from "@/types/loanType";
import api from "./axios";
import { LoanResponse } from "@/types/loan";


// TODO: dodati filter po vrsti kredita kada backend zavrsi 
export const getAllLoans = async (
    page: number,
    size: number,
    filters: { accountNumber?: string; loanTypeName?: string; loanStatus?: string }
): Promise<LoanResponse> => {
    try {
        const response = await api.get("/loans", {
            params: {
                accountNumber: filters.accountNumber || undefined,
                loanTypeId: filters.loanTypeName || undefined,
                loanStatus: filters.loanStatus || undefined,
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

export const getAllLoanTypes = async (
    page: number,
    size: number
): Promise<LoanTypeResponse> => {
    try {
        const response = await api.get("/loans/types", {
            params: {
                page,
                size,
            },
        });

        return response.data; // API returns an array of loan types
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};