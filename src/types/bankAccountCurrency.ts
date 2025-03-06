import {Currency} from "@/types/currency.ts";
import {Employee} from "@/types/user.ts";
import {BankAccount} from "@/types/bankAccount.ts";

export interface BankAccountCurrency{
    id: string;
    account: BankAccount;
    currency: Currency;
    employee: Employee;
    balance: number;
    availableBalance: number;
    dailyLimit: number;
    monthlyLimit: number;
    createdAt: Date;
    modifiedAt: Date;
}