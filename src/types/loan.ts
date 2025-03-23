import { BankAccount } from "./bank-account.ts";
import { Currency } from "./currency";
import { LoanType } from "./loan-type.ts";

export interface Loan{
    id: string,
    type: LoanType,
    account: BankAccount,
    amount: number,
    period: number,
    creationDate: Date,
    maturityDate: Date,
    currency: Currency,
    status: LoanStatus,
    interestType: InterestType,
    createdAt: Date,
    modifiedAt: Date,
    nominalInstallmentRate: number,
    remainingAmount: number,
}


export interface LoanResponse{
    items: Loan[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}


export interface LoanUpdateRequest{
    status: LoanStatus;
    maturityDate: Date,
}


export interface LoanCreateRequest{
    typeId: string,
    accountId: string,
    amount: number,
    period: number,
    currencyId: string,
    interestType: InterestType
}




// ENUMS

export enum LoanStatus {
    Pending,
    Active,
    Rejected,
    Closed,
    DefaultWarning,
    Default
}


export enum InterestType {
    Fixed,
    Variable,
    Mixed
}

export const getInterestType = (type: number) => {
    switch (type) {
        case 0:
            return "Fixed";
        case 1:
            return "Variable";
        default:
            return "Unknown";

    }
}