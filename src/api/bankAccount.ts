import api from "./axios"
import {AccountResponse, AccountUpdateClientRequest, CreateBankAccountRequest} from "@/types/bankAccount"
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

export const editAccountClient = async(id: string, data: AccountUpdateClientRequest) => {
    try {
        const response = await api.put(`${API_BASE}/accounts/client/${id}`, data);
        return response;
    } catch (error) {
        console.error("Failed to edit bank account! :", error);
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





export const getAllCreditCardsForBankAccount = async (accountId: string) => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${accountId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get credit cards for bank account:", error);
        throw error;
    }
}


export const getAllAccountsClient = async (clientId: string) => {
    try {
        const response = await api.get(`${API_BASE}/clients/${clientId}/accounts`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get bank accounts for client:", error);
        throw error;
    }
}


