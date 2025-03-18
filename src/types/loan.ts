import { BankAccount } from "./bankAccount";
import { Currency } from "./currency";
import { LoanType } from "./loanType";

export interface Loan{
    id: string,
    type: LoanType,
    account: BankAccount,
    amount: number,
    period: number,
    creationDate: Date,
    maturityDate: Date,
    currency: Currency,
    status: number,
    interestType: number,
    createdAt: Date,
    modifiedAt: Date,
}


export interface LoanResponse{
    items: Loan[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}