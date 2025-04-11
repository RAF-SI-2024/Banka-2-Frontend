import React, {useState} from "react";

import TaxCard from "@/components/portfolio/TaxCard.tsx";
import TotalProfitCard from "@/components/portfolio/TotalProfitCard.tsx";
import PortfolioTable from "@/components/portfolio/PortfolioTable.tsx";
import {PortfolioBalanceData, PortfolioTaxData} from "@/types/portfolio-data.ts";
import {mockPortfolioBalanceData, mockPortfolioTaxData} from "@/mocks/PortfolioDataMock.tsx";
import PortfolioTableCard from "@/components/portfolio/PortfolioTableCard.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

export default function MyPortfolioPage() {

    const [portfolioBalanceData, setPortfolioBalanceData] = useState<PortfolioBalanceData>(mockPortfolioBalanceData);
    const [portfolioTaxData, setPortfolioTaxData] = useState<PortfolioTaxData>(mockPortfolioTaxData);

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Toaster richColors />
                <h1 className="font-display font-bold text-5xl">My portfolio</h1>

                <div className="grid md:grid-cols-2 auto-rows-min gap-4">
                    <TotalProfitCard balance={portfolioBalanceData}></TotalProfitCard>
                    <TaxCard amount={portfolioTaxData}></TaxCard>
                    <PortfolioTableCard className="md:col-span-2"/>
                </div>



            </main>
        </>
    )
}