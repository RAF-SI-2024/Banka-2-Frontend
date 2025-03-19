export interface Transaction {
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
    referenceNumber: string;
    purpose: string;
}