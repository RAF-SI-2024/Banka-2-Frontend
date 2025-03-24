import api from "@/api/axios";

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
    console.log("CURRENCY", accountNumber);
    const response = await api.get("/accounts", {
        params: { Number: accountNumber.substring(7,16) }, // FIXME: Ovde treba da stoji samo accountNumber
    });

    console.log(response);

    return response.data.items?.[0].currency.id;


};