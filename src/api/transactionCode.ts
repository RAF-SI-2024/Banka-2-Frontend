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

export const fetchRecipientCurrencyId = async (
    accountNumber: string
): Promise<string | null> => {
    const response = await api.get("/accounts", {
        params: { Number: accountNumber },
    });

    const account = response.data.items?.[0];

    const currencyId =
        account?.accountCurrencies?.find((c: AccountCurrency) => c.currency?.id)?.currency?.id ??
        account?.currency?.id ??
        null;

    return currencyId;
};