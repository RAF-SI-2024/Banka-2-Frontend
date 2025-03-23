import {BankAccount} from "@/types/bank-account.ts";
import {CardType} from "@/types/card-type.ts";

export interface CardDTO {
    id: string;
    type: CardType;
    number: string,
    name: string;
    expiresAt: Date;
    account: BankAccount;
    cvv: string;
    limit: number;
    status: boolean;
    createdAt: Date;
    modifiedAt: Date;
}

export interface CardCreateRequest {
    cardTypeId: string;
    accountId: string;
    name: string;
    limit: number;
    status: boolean;
}