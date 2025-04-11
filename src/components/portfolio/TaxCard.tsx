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
                <div className="flex flex-col space-y-2 h-full justify-center">

                    <h6 className="text-4xl font-heading font-medium ">
                        {formatCurrency(amount.currentYear, amount.currency.code)}
                    </h6>
                    <p className="text-sm font-paragraph text-muted-foreground">Paid Tax (Year)</p>
                    <h6 className="text-4xl font-heading font-medium ">
                        {formatCurrency(amount.leftToPay, amount.currency.code)}
                    </h6>
                    <p className="text-sm font-paragraph text-muted-foreground">Total amount to be paid</p>
                </div>
            </Card>
        </>
    )
}