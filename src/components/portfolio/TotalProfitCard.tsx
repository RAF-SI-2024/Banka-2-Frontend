import {cn} from "@/lib/utils.ts";
import PiggyBank from "@/assets/PiggyBank.tsx";
import {Card} from "@/components/ui/card.tsx";
import React from "react";
import {PortfolioBalanceData, PortfolioTaxData} from "@/types/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import PortfolioUp from "@/assets/PortfolioUp.tsx";
import PortfolioDown from "@/assets/PortfolioDown";

export default function TotalProfitCard({balance }: {balance: PortfolioBalanceData}) {

    return (
        <>
            <Card
                className={cn(
                    "border-0 p-6 flex flex-col lg:flex-row lg:items-center justify-between ",
                )}
            >
                <div className="flex flex-col space-y-2">

                    <p className="text-4xl font-heading font-medium mt-8">
                        {formatCurrency(balance.profit, balance.currency.code)}
                    </p>
                    <p className="text-md opacity-80">Total Profit</p>
                </div>
                <div className="flex justify-center lg:justify-end pt-8 lg:pt-0">
                    {balance.profit >=0 ? <PortfolioUp className="size-full"/>: <PortfolioDown className="size-full"/>}
                </div>
            </Card>
        </>
    )
}