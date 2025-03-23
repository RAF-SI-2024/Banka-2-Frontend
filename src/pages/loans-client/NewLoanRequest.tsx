import {Toaster} from "@/components/ui/sonner.tsx";
import {LoanRequestForm} from "@/components/loans/new-loan-request/LoanRequestForm.tsx";
import React from "react";

export default function NewLoanRequest() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl w-full text-center">Request a loan</h1>
            <div className="w-full justify-center flex">
                <LoanRequestForm />
            </div>
        </main>
    );
}
