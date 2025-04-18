import {api_bank_user} from "../axios.ts"
import {AccountResponse, AccountUpdateClientRequest, CreateBankAccountRequest} from "@/types/bank_user/bank-account.ts"


export const getAccountById = async (id:string) => {
    try {
        const response = await api_bank_user.get(`/accounts/${id}`, {
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
        const response = await api_bank_user.get("/accounts", {
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

export const editAccountClient = async (id: string, data: AccountUpdateClientRequest) => {
    try {
        // Make sure to omit the 'name' property if it's undefined or null
        const requestData: AccountUpdateClientRequest = {
            dailyLimit: data.dailyLimit,
            monthlyLimit: data.monthlyLimit,
            name: data.name
        };

        const response = await api_bank_user.put(`/accounts/client/${id}`, requestData);
        return response;
    } catch (error) {
        console.error("Failed to edit bank account! :", error);
        throw error;
    }
};



export const getAllCreditCardsForBankAccount = async (accountId: string) => {
    try {
        const response = await api_bank_user.get(`/accounts/${accountId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get credit cards for bank account:", error);
    }
}

export const activateOrDeactivateBankAccount = async (accountId: string, status: boolean) => {
    try {
        const response = await api_bank_user.put(`/accounts/employee/${accountId}`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("❌ Failed to activate/deactivate bank account:", error);
        throw error;
    }
}

export const getAllAccountsClient = async (clientId: string, page?:number, size?:number) => {
    try {
        const response = await api_bank_user.get(`/clients/${clientId}/accounts`, {
            params: {
                page,      // Prosleđujemo broj stranice
                size,  // Prosleđujemo veličinu stranice
            }
        });
        return response;
    } catch (error) {
        console.error("❌ Failed to get bank accounts for client:", error);
        throw error;
    }
}

export const getAllAccountClientWithFilters = async (
    clientId: string,
    page?: number,
    size?: number,
    filters?: { accountNumber?: string; firstName?: string; lastName?: string }
) => {
    try {
        const response = await api_bank_user.get(`/clients/${clientId}/accounts`, {
            params: {
                number: filters?.accountNumber,
                clientFirstName: filters?.firstName,
                clientLastName: filters?.lastName,
                page,
                size,
            },
        });
        return response.data;  // Return only the necessary data
    } catch (error) {
        console.error("❌ Failed to get bank accounts for client with filters:", error);
        throw error; // Re-throw to handle it in the calling function
    }
};


export const createAccount = async (data: CreateBankAccountRequest) => {
    try {
        const response = await api_bank_user.post("/accounts", data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ Failed to create account:", error);
        throw error;
    }
};