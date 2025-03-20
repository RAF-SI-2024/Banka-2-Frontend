import {BankAccount} from "@/types/bankAccount.ts";
import {Currency} from "@/types/currency.ts";
import {TransactionStatus} from "@/types/enums.ts";

export interface Transaction {
    id: string,
    fromAccount: BankAccountSimple | null,
    toAccount: string | null,
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

export interface BankAccountSimple {
    id: string,
    accountNumber: string,
}

export interface TransactionResponse {
    items: Transaction[],
    pageNumber: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    id: string,
    name: string,
    amount: number,
    date: Date
}

export interface CreateTransactionRequest {
    fromAccountId: string;
    fromCurrencyId: string;
    toAccountNumber: string;
    toCurrencyId: string;
    amount: number;
    codeId: string;
    referenceNumber?: string;
    purpose: string;
}