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