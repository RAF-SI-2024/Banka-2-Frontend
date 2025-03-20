import React from "react";
import { Toaster} from "@/components/ui/sonner"
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";
import ExchangeRateListTable from "@/components/exchangeRateList/ExchangeRateListTable.tsx";

export default function ExchangeRateListPage() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Exchange rate list</h1>
            <div className="mt-4 mb-16 border border-border rounded-lg bg-card/25">
                <ExchangeRateListTable />
            </div>
        </main>
    )
}
