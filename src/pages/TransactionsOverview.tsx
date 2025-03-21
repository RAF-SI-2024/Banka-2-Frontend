import React from "react";
import { Toaster} from "@/components/ui/sonner"
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";
import TransactionsDataTable from "@/components/bank-account/TransactionsDataTable.tsx";

export default function TransactionsOverviewPage() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Transactions overview</h1>
            <div>
                <TransactionsDataTable />
            </div>
        </main>
    )
}
