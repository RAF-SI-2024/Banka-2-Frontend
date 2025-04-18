import {Currency} from "@/types/bank_user/currency.ts";
import {Employee} from "@/types/bank_user/user.ts";
import {BankAccount} from "@/types/bank_user/bank-account.ts";

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