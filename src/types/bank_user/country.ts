import { Currency } from "./currency.ts";

export interface Country{
    id: string;
    name: string;
    currency: Currency;
    createdAt: Date;
    modifiedAt: Date;
}