import {Role} from "@/types/bank_user/user.ts";

export interface Tax {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: TaxRole;
    debt: number;
}

export enum TaxRole {
    Client = 0,
    Actuar = 1,
}

export const getTaxRoleString = (taxRole: TaxRole): string => {
    switch (taxRole) {
        case TaxRole.Client:
            return "Client";
        case TaxRole.Actuar:
            return "Actuar";
        default:
            return "Unknown";
    }
};