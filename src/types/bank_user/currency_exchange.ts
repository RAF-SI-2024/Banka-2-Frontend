import {Currency} from "@/types/bank_user/currency.ts";

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