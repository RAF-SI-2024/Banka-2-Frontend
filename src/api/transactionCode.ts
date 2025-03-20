import api from "@/api/axios";
import {AccountCurrency} from "@/components/newPayment/PayerAccountSelect.tsx";

export interface RawPaymentCode {
    id: string;
    code: string;
    name: string;
}

export const fetchPaymentCodes = async (): Promise<RawPaymentCode[]> => {
    const response = await api.get("transactions/codes", {
        params: { page: 1, size: 100 },
    });
    return response.data.items || [];
};

export const fetchRecipientCurrencyCode = async (
    accountNumber: string
): Promise<string | null> => {
    const response = await api.get("/accounts", {
        params: { Number: accountNumber },
    });

    console.log(response);

    return response.data.items?.[0].currency.id;


};