import {cn} from "@/lib/utils.ts";
import {Card} from "@/components/ui/card.tsx";
import React from "react";
import {PortfolioTaxData} from "@/types/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";

export default function TaxCard({amount }: {amount: PortfolioTaxData}) {

    return (
        <>
            <Card
                className={cn(
                    "border-0 p-6 w-full flex flex-col lg:flex-row lg:items-center justify-between shadow-lg"
                )}
            >
                <div className="flex flex-col space-y-2">

                    <h6 className="text-4xl font-bold">
                        {formatCurrency(amount.currentYear, amount.currency.code)}
                    </h6>
                    <p className="text-sm opacity-80">Paid Tax (Year)</p>
                    <h6 className="text-4xl font-bold">
                        {formatCurrency(amount.leftToPay, amount.currency.code)}
                    </h6>
                    <p className="text-sm opacity-80">Amount of tax left to be paid</p>
                </div>
            </Card>
        </>
    )
}