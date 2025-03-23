import {Toaster} from "@/components/ui/sonner.tsx";
import LoanOverviewTable from "@/components/loans/client/LoanOverviewTable.tsx";
import React from "react";


export default function LoanOverviewList() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">My loans</h1>
            <div className="lg:-mt-12">
                <LoanOverviewTable />
            </div>
        </main>
    );
}
