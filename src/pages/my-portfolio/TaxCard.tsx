import {cn} from "@/lib/utils.ts";
import PiggyBank from "@/assets/PiggyBank.tsx";
import {Card} from "@/components/ui/card.tsx";
import React from "react";

export default function TaxCard({paidTax, unpaidTax }: {paidTax:any, unpaidTax:any}) {

    return (
        <>
            <Card
                className={cn(
                    "border-0 p-6 w-full flex flex-col lg:flex-row lg:items-center justify-between text-white shadow-lg"
                )}
            >
                <div className="flex flex-col space-y-2">

                    <h6 className="text-4xl font-bold">
                        ${paidTax.toLocaleString()}
                    </h6>
                    <p className="text-sm opacity-80">Paid Tax (Year)</p>
                    <h6 className="text-4xl font-bold">
                        ${unpaidTax.toLocaleString()}
                    </h6>
                    <p className="text-sm opacity-80">Amount of tax left to be paid</p>
                </div>
            </Card>
        </>
    )
}