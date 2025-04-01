import {cn} from "@/lib/utils.ts";
import PiggyBank from "@/assets/PiggyBank.tsx";
import {Card} from "@/components/ui/card.tsx";
import React from "react";

export default function TotalProfitCard({balance} : any) {

    return (
        <>
            <Card
                className={cn(
                    "border-0 p-6 flex flex-col lg:flex-row lg:items-center justify-between text-white shadow-lg"
                )}
            >
                <div className="flex flex-col space-y-2">

                    <p className="text-4xl font-bold">
                        ${balance.toLocaleString()}
                    </p>
                    <p className="text-md opacity-80">Total Profit</p>
                </div>
                <PiggyBank className="size-48 opacity-90" />
            </Card>
        </>
    )
}