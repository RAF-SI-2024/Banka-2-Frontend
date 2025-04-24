import {Currency} from "@/types/bank_user/currency.ts";

export interface Exchange {
    name: string;
    acronym: string;
    mic: string;
    polity: string;
    currency: Currency;
    timeZone: string;
    openTime: string;
    closeTime: string;
}


export interface ExchangeResponse {
    items: Exchange[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}