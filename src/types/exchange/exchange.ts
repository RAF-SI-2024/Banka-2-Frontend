import {Currency} from "@/types/bank_user/currency.ts";

export interface ExchangeTableData {
    name: string;
    acronym: string;
    mic: string;
    polity: string;
    currency: Currency;
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