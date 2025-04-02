import {cn} from "@/lib/utils.ts";
import PiggyBank from "@/assets/PiggyBank.tsx";
import {Card} from "@/components/ui/card.tsx";
import React from "react";
import {PortfolioBalanceData, PortfolioTaxData} from "@/types/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";

export default function TotalProfitCard({balance }: {balance: PortfolioBalanceData}) {

    return (
        <>
            <Card
                className={cn(
                    "border-0 p-6 flex flex-col lg:flex-row justify-between shadow-lg"
                )}
            >
                <div className="flex flex-col space-y-2">

                    <p className="text-4xl font-bold mt-8">
                        {formatCurrency(balance.profit, balance.currency.code)}
                    </p>
                    <p className="text-md opacity-80">Total Profit</p>
                </div>
                <PiggyBank className="size-48 opacity-90" />
            </Card>
        </>
    )
}