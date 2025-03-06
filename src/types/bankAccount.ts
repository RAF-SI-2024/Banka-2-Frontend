import {Client, Employee} from "@/types/user.ts";
import {Currency} from "@/types/currency.ts";
import {BankAccountType} from "@/types/bankAccountType.ts";

export interface BankAccount {
    id: string;
    name: string,
    client: Client;
    accountNumber: number;
    balance: number;
    availableBalance: number;
    employee: Employee;
    currency: Currency;
    accountType: BankAccountType;
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




