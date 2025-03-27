import {Toaster} from "@/components/ui/sonner.tsx";
import React from "react";
import BankAccountCardsCard from "@/components/bank-account/bank-account-single/BankAccountCards.tsx";
import SecurityDetails from "@/components/securities/SecurityDetails.tsx";


const securities = [
    {
        name: "Security1",
    }
]

export default function Security() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
            <Toaster richColors />
            {!securities || securities.length === 0 ? (
                <h1 className="text-center text-2xl font-semibold text-destructive">
                    Failed to fetch securities
                </h1>
            ) : (
                <>
                    <h1 className="font-display font-bold text-5xl">
                        {securities[0].name} overview
                    </h1>

                    <div className="grid grid-rows-min gap-4 md:grid-cols-8 h-full">
                        <SecurityDetails className="col-span-6 max-w-[1200px] "/>
                        <SecurityDetails className="col-span-2"/>
                    </div>
                </>
            )}
        </main>

    );
}