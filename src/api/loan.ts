import { LoanTypeResponse } from "@/types/loanType";
import api from "./axios";
import {InstallmentResponsePage, Loan, LoanCreateRequest, LoanResponse} from "@/types/loan";


export const getAllLoans = async (
    page: number,
    size: number,
    filters: { accountNumber?: string; loanTypeName?: string; loanStatus?: string }
): Promise<LoanResponse> => {
    try {
        const response = await api.get("/loans", {
            params: {
                accountNumber: filters.accountNumber || undefined,
                loanTypeId: filters.loanTypeName || undefined,
                loanStatus: filters.loanStatus || undefined,
                page,
                size,
            },
        });

        return response.data; // API returns an array of u
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};

export const getAllLoanTypes = async (
    page?: number,
    size?: number
): Promise<LoanTypeResponse> => {
    try {
        const response = await api.get("/loans/types", {
            params: {
                page,
                size,
            },
        });

        return response.data; // API returns an array of loan types
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};


// put request to update loan status, LoanUpdateRequest

// put request to update loan status, LoanUpdateRequest
export const updateLoanStatus = async (loanId: string, loanUpdateRequest: LoanUpdateRequest) => {
    try {
        const response = await api.put(`/loans/${loanId}`, loanUpdateRequest);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to update loan status:", error);
        throw error;
    }
};

export const createLoan = async(
    data: LoanCreateRequest
): Promise<Loan> => {
    try{
        const response = await api.post("/loans", data);

        return response.data;
    }
    catch(error){
        console.error("Error creating loan", error);
        throw error;
    }
}


export const getLoanById = async(loanId: string): Promise<Loan> => {
    try{
        const response = await api.get(`/loans/${loanId}`);

        return response.data;
    }
    catch(error){
        console.error("Error creating loan", error);
        throw error;
    }
}

export const getLoanInstallments = async(loanId: string, page: number, size: number)
    : Promise<InstallmentResponsePage> => {
    try{
        const response = await api.get("/installments", {
            params: {
                loanId: loanId,
                page: page,
                size: size,
            }
        });

        return response.data;
    }
    catch(error){
        console.error("Error fetching installments", error);

      
export const getLoansByClientId = async (
    page: number,
    size: number,
    clientId: string
): Promise<LoanResponse> => {
    try {
        const response = await api.get(`/loans/clients/${clientId}`, {
            params: {
                clientId: clientId,
                page,
                size,
            },
        });

        return response.data; // API returns an array of u
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
}