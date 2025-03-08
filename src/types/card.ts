import {BankAccount} from "@/types/bankAccount.ts";
import {CardType} from "@/types/cardType.ts";

export interface Card{
    id: string;
    type: CardType;
    name: string;
    expiresAt: Date;
    account: BankAccount;
    cvv: string;
    limit: number;
    status: boolean;
    createdAt: Date;
    modifiedAt: Date;
}