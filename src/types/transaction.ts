import {BankAccount} from "@/types/bankAccount.ts";
import {Currency} from "@/types/currency.ts";
import {TransactionStatus} from "@/types/enums.ts";

export interface Transaction {
    id: string,
    fromAccount: BankAccount,
    toAccount: BankAccount,
    currencyFrom: Currency,
    currencyTo: Currency,
    fromAmount: number,
    toAmount: number,
    // Napraviti code interface
    // code: string,

    referenceNumber: string;
    purpose: string;
    status: TransactionStatus;
    createdAt: string;
    modifiedAt: string;

}

export interface TransactionResponse {
    items: Transaction[],
    pageNumber: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
}