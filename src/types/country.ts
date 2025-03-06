import { Currency } from "./currency";

export interface Country{
    id: string;
    name: string;
    currency: Currency;
    createdAt: Date;
    modifiedAt: Date;
}