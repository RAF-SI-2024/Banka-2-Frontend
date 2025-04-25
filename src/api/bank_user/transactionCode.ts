import {api_bank_user} from "@/api/axios.ts";
import {TransactionCodeResponse} from "@/types/bank_user/transaction.ts";

export interface RawPaymentCode {
    id: string;
    code: string;
    name: string;
}

export const fetchPaymentCodes = async (): Promise<RawPaymentCode[]> => {
    const response = await api_bank_user.get("transactions/codes", {
        params: { page: 1, size: 100 },
    });
    return response.data.items || [];
};

export const fetchRecipientCurrencyCode = async (
    accountNumber: string
): Promise<string | null> => {
    console.log("CURRENCY", accountNumber);
    const response = await api_bank_user.get("/accounts", {
        params: { Number: accountNumber},
    });
    console.log("RESP: ", response);

    console.log(response);

    return response.data.items?.[0].currency.id;


};

export const getTransactionCodes = async (
    pageNumber: number,
    pageSize: number
): Promise<TransactionCodeResponse> => {
    try {
        const response = await api_bank_user.get("/transactions/codes", {
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