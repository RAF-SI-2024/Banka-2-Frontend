export interface TransactionCode {
    id: string;
    code: string;
    name: string;
}

export interface TransactionCodeResponse {
    items: TransactionCode[];
    totalElements: number;
}