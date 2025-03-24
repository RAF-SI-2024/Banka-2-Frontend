import {Toaster} from "@/components/ui/sonner.tsx";
import AllLoanTable from "@/components/loans/employee/allLoansTable/AllLoanTable.tsx";
import React from "react";


export default function AllLoanList() {
    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">All loans</h1>
            <AllLoanTable />
        </main>
    );
}
