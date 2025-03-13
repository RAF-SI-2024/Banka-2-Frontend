import api from "./axios"
import {AccountResponse, CreateBankAccountRequest} from "@/types/bankAccount"
import {API_BASE} from "@/constants/endpoints.ts";


export const getAccountById = async (id:string) => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${id}`, {
            params:{
                id: id
            } //  TODO: izbaciti kada backend popravi
        });
        return response;
    } catch (error) {
        console.error("Failed to get bank account! :", error);
        throw error;
    }
}

export const getAllAccounts = async (
    pageNumber: number,
    pageSize: number,
    filters: { accountNumber?: string; firstName?: string; lastName?: string;}
): Promise<AccountResponse> => {
    try {
        console.log("Page number", pageNumber);
        console.log("Page size", pageSize);
        const response = await api.get("/accounts", {
            params: {
                number: filters.accountNumber || undefined,
                clientFirstName: filters.firstName || undefined,
                clientLastName: filters.lastName || undefined,
                Page: pageNumber,
                Size: pageSize,
            },
        });
        return response.data;
    }
    catch(error) {
        console.error("❌ Error fetching bank accounts:", error);
        throw error;
    }
}


export const createBankAccount = async (data : CreateBankAccountRequest, currency : string) => {

    try {
        const currencyResponse = await api.get("/currencies", {
            params: {
                code: currency
            }   
        });

        data.currencyId = currencyResponse.data.items[0]?.id;
        
        const response = await api.post("/accounts", data);
        return response;
    } catch (error) {
        console.error("❌ Failed to create bank account:", error);
        throw error;
    }

}

export const activateOrDeactivateBankAccount = async (accountId: string, status: boolean) => {
    try {
        const response = await api.put(`${API_BASE}/accounts/employee/${accountId}`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("❌ Failed to activate/deactivate bank account:", error);
        throw error;
    }
}

export const getAllCreditCardsForBankAccount = async (accountId: string) => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${accountId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get credit cards for bank account:", error);
        throw error;
    }
}



