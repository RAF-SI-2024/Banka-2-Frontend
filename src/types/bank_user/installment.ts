import {Loan} from "@/types/bank_user/loan.ts";

export interface Installment {
    id: string,
    loan: Loan,
    interestRate: number,
    expectedDueDate: Date,
    actualDueDate: Date,
    status: InstallmentStatus,
    createdAt: Date,
    modifiedAt: Date,
    amount: number,
}

export interface InstallmentResponsePage{
    items: Installment[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export interface InstallmentUpdateRequest{
    actualDueDate: Date,
    status: InstallmentStatus,
}

export interface InstallmentRequest{
    loanId: string,
    interestRate: number,
    expectedDueDate: Date,
    actualDueDate: Date,
    status: InstallmentStatus,
}


// ENUMS

export enum InstallmentStatus {
    Pending,
    Paid,
    Overdue,
    Cancelled
}