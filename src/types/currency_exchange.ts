import {Currency} from "@/types/currency.ts";

export type CurrencyExchange = {
    id: string,
    currencyFrom: Currency,
    currencyTo: Currency,
    commission: number,
    rate: number,
    inverseRate: number,
    createdAt: Date,
    modifiedAt: Date,
}