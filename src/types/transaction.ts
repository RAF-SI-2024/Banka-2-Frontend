import {Currency} from "@/types/currency.ts";


export interface Transaction {
    id: string,
    fromAccount: BankAccountSimple | null,
    toAccount: BankAccountSimple | null,
    fromCurrency: Currency,
    toCurrency: Currency,
    fromAmount: number,
    toAmount: number,
    code: TransactionCode,
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
    fromAccountNumber: string;
    fromCurrencyId: string;
    toAccountNumber: string;
    toCurrencyId: string;
    amount: number;
    codeId: string;
    referenceNumber?: string;
    purpose: string;
}

export interface TransactionTableRow {
    fromAccountNumber: string | null,
    toAccountNumber: string | null,
    amount: number,
    currencyCode: string,
    date: Date
    type: TransactionType,
    status: TransactionStatus,
    purpose?: string,
}

export interface TransactionCode {
    id: string;
    code: string;
    name: string;
}

export interface TransactionCodeResponse {
    items: TransactionCode[];
    totalElements: number;
}

export enum TransactionType {
    Withdraw = "Withdraw",
    Deposit = "Deposit",
    Transaction = "Transaction",
    Exchange = "Exchange",
    Transfer = "Transfer",
}

export enum TransactionStatus
{
    Invalid = 0,
    Pending = 1,
    Canceled = 2,
    Affirm = 3,
    Completed = 4,
    Failed = 5
}
