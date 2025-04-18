import {Country} from "@/types/bank_user/country.ts";

export interface Currency{
    id: string;
    name: string;
    code: string;
    symbol: string;
    countries: Country[];
    description: string;
    status: boolean;
    createdAt: Date;
    modifiedAt: Date;
}