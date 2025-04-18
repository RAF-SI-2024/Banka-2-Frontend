import {Client, Employee} from "@/types/bank_user/user.ts";
import {Currency} from "@/types/bank_user/currency.ts";
import {BankAccountType} from "@/types/bank_user/bank-account-type.ts";

export interface BankAccount {
    id: string;
    name: string,
    client: Client;
    accountNumber: number | string;
    balance: number;
    availableBalance: number;
    employee: Employee;
    currency: Currency;
    type: BankAccountType;
    dailyLimit: number;
    monthlyLimit: number;
    status: boolean;
    creationDate: Date;
    expirationDate: Date;
    createdAt: Date;
    modifiedAt: Date;
}



export interface AccountResponse {
    items: BankAccount[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
}

export interface CreateBankAccountRequest {
    name: string,
    dailyLimit: number,
    clientId: string,
    balance : number,
    currencyId: string,
    accountTypeId: string,
    monthlyLimit: number,
    status: boolean,
}

export interface AccountUpdateClientRequest{
    name:	string,
    dailyLimit: number,
    monthlyLimit: number,
}




