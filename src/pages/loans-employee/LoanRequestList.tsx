import {Toaster} from "@/components/ui/sonner.tsx";
import LoanRequestTable from "@/components/loans/employee/requestTable/LoanRequestTable.tsx";
import React from "react";


export default function LoanRequestList() {
    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Loan requests</h1>
            <LoanRequestTable />
        </main>
    );
}
