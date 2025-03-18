import api from "@/api/axios.ts";
import {TransactionCodeResponse} from "@/types/transfers.ts";
import {CreateTransactionRequest} from "@/types/transaction.ts";

export const getTransactionCodes = async (
    pageNumber: number,
    pageSize: number
): Promise<TransactionCodeResponse> => {
    try {
        const response = await api.get("/transactions/codes", {
            params: {
                Page: pageNumber,
                Size: pageSize,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching transaction codes:", error);
        throw error;
    }
};

export const createTransaction = async (transactionData: CreateTransactionRequest) => {
    try {
        const response = await api.post("/transactions", transactionData);
        return response.data;
    } catch (error) {
        console.error("❌ Error while creating transaction:", error);
        throw error;
    }
};