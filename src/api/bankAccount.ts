import api from "./axios"
import { BankAccount } from "@/types/bankAccount"


export const getAllAccounts = async (
    pageNumber: number,
    pageSize: number,
    filters: { accountNumber?: string; firstName?: string; lastName?: string;}
): Promise<BankAccount> => {
    try {
        const response = await api.get("/accounts", {
            params: {
                accountNumber: filters.accountNumber || undefined,
                firstName: filters.firstName || undefined,
                lastName: filters.lastName || undefined,
                pageNumber,
                pageSize,
            },
        });
        return response.data;
    }
    catch(error) {
        console.error("❌ Error fetching bank accounts:", error);
        throw error;
    }
}
