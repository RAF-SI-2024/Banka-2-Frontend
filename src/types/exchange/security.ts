import {Exchange} from "@/types/exchange/exchange.ts";

export interface SecurityDailyResponse {
    id: string;
    name: string;
    ticker: string;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    closePrice: number;
    volume: number;
    stockExchange: Exchange;
    priceChangeInInterval: number;
    priceChangePercentInInterval: number;
    quotes: QuoteDailySimpleResponse[];
    createdAt: Date;
    modifiedAt: Date;
}


export interface Security {
    id: string;
    name: string;
    ticker: string;
    highPrice: number;
    lowPrice: number;
    askPrice: number;
    bidPrice: number;
    volume: number;
    stockExchange: Exchange;
    priceChangeInInterval: number;
    priceChangePercentInInterval: number;
    quotes: QuoteSimpleResponse[];
    createdAt: Date;
    modifiedAt: Date;
}

export interface QuoteSimpleResponse{
    id: string;
    highPrice: number;
    lowPrice: number;
    askPrice: number;
    bidPrice: number;
    volume: number;
    createdAt: string;
    modifiedAt: string;
}

export interface QuoteDailySimpleResponse {
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    closePrice: number;
    volume: number;
    createdAt: string;
    modifiedAt: string;
}

export interface SecuritySearchFilters{
    ticker: string;
    name: string;

}

export interface SecuritySimple {
    id: string;
    name: string;
    ticker: string;
    askPrice: number;
    stockExchange?: Exchange;
    priceChangePercentInInterval: number;
}

export interface SecurityResponse {
    items: Security[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export interface SecuritySimpleResponse {
    items: SecuritySimple[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export enum SecurityType {
    Stock,
    Future,
    Forex,
    Option,
    Unknown
}

export function getSecurityTypeName(type: SecurityType): string {
    switch(type){
        case SecurityType.Stock:
            return 'Stock';
        case SecurityType.Future:
            return 'Future';
        case SecurityType.Forex:
            return 'Forex';
        case SecurityType.Option:
            return 'Option';
        default:
            return 'Unknown';
    }
}

export function getSecurityTypePlural(type: SecurityType): string {
    switch(type){
        case SecurityType.Stock:
            return 'Stocks';
        case SecurityType.Future:
            return 'Futures';
        case SecurityType.Forex:
            return 'Forex';
        case SecurityType.Option:
            return 'Options';
        default:
            return 'Unknown';
    }
}

export function getSecurityTypeRoute(type: SecurityType): string {
    switch(type){
        case SecurityType.Stock:
            return '/stock';
        case SecurityType.Future:
            return '/future/contract';
        case SecurityType.Forex:
            return '/forex/pair';
        case SecurityType.Option:
            return '/option';
        default:
            return '/stock';
    }
}

export function getSecurityTypeFromString(type: string): SecurityType {
    switch(type.toLowerCase()){
        case "stock":
            return SecurityType.Stock;
        case "future":
            return SecurityType.Future;
        case "forex":
            return SecurityType.Forex;
        case "option":
            return SecurityType.Option;
        default:
            return SecurityType.Unknown;
    }
}

export interface QuoteFilterQuery
{
    // exchangeId: string; FIXME: zasto ovo uopste postoji
    interval: QuoteIntervalType;
    name?: string | null;
    ticker?: string | null;
    // FIXME: fale filteri po askPrice, bidPrice, amount i exchange acronym-u
    // FIXME: fale razliciti nacini sortiranja
}

export enum QuoteIntervalType{
    Week,
    Day,
    Month,
    ThreeMonths,
    Year,
    Max
}
