import React, {useState} from "react";

import TaxCard from "@/pages/my-portfolio/TaxCard.tsx";
import TotalProfitCard from "@/pages/my-portfolio/TotalProfitCard.tsx";
import PortfolioTable from "@/pages/my-portfolio/PortfolioTable.tsx";
import {PortfolioBalanceData, PortfolioTaxData} from "@/types/portfolio-data.ts";
import {mockPortfolioBalanceData, mockPortfolioTaxData} from "@/mocks/PortfolioDataMock.tsx";

export default function MyPortfolioPage() {

    const [portfolioBalanceData, setPortfolioBalanceData] = useState<PortfolioBalanceData>(mockPortfolioBalanceData);
    const [portfolioTaxData, setPortfolioTaxData] = useState<PortfolioTaxData>(mockPortfolioTaxData);

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 pt-0">
                <h1 className="font-display font-bold text-5xl">My portfolio</h1>

                <div className="flex flex-row min-w-full gap-12">
                    <TotalProfitCard balance={portfolioBalanceData}></TotalProfitCard>
                    <TaxCard amount={portfolioTaxData}></TaxCard>

                </div>
                <PortfolioTable></PortfolioTable>

            </main>
        </>
    )
}