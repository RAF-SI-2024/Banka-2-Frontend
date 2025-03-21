import api from "@/api/axios.ts";
import {TransactionCodeResponse} from "@/types/transfers.ts";
import {CreateTransactionRequest, TransactionResponse} from "@/types/transaction.ts";
import {API_BASE} from "@/constants/endpoints.ts";
import {TransactionStatus} from "@/types/enums.ts";

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




export const getAllTransactions = async (
    pageNumber?: number,
    pageSize?: number,
    fromDate?: Date,
    toDate?: Date,
    status?: TransactionStatus,
    transactionType?: number,
): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/transactions`, {
                params: {
                    Page: pageNumber,
                    Size: pageSize,
                    Type: transactionType,
                    FromDate: fromDate?.toDateString(),
                    ToDate: toDate?.toDateString(),
                    status: status,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get all transactions:", error);
        throw error;
    }
}

export const getAccountTransactions = async (
    accountId: string,
    pageNumber?: number,
    pageSize?: number,
    fromDate?: Date,
    toDate?: Date,
    status?: TransactionStatus,
    transactionType?: number,
): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${accountId}/transactions`, {
                params: {
                    Page: pageNumber,
                    Size: pageSize,
                    Type: transactionType,
                    FromDate: fromDate,
                    ToDate: toDate,
                    Status: status,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get all transactions for your bank account:", error);
        throw error;
    }
}

export const getNewTransactions = async (): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/transactions`,{
            params: {
                Page: 1,
                Size: 5
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get recent transactions:", error);
        throw error;
    }
}