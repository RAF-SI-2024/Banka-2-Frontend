import {Currency} from "@/types/currency.ts";

export type Exchange = {
    id: string,
    currencyFrom: Currency,
    currencyTo: Currency,
    commission: number,
    rate: number,
    inverseRate: number,
    createdAt: Date,
    modifiedAt: Date,
}

export interface ExchangeTableData {
    name: string;
    acronym: string;
    micCode: string;
    country: string;
    currency: string;
    timeZone: string;
    openTime: string;
    closeTime: string;
}


export interface ExchangeTableDataResponse {
    items: ExchangeTableData[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}