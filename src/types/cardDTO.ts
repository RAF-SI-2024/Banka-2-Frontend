import {BankAccount} from "@/types/bankAccount.ts";
import {CardType} from "@/types/cardType.ts";

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