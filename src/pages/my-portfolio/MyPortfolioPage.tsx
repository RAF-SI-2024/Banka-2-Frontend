import React from "react";

import TaxCard from "@/pages/my-portfolio/TaxCard.tsx";
import TotalProfitCard from "@/pages/my-portfolio/TotalProfitCard.tsx";
import PortfolioTable from "@/pages/my-portfolio/PortfolioTable.tsx";




export default function MyPortfolioPage() {




    return (
        <>
            <main className="flex flex-1 flex-col gap-4 pt-0">
                <h1 className="font-display font-bold text-5xl">My portfolio</h1>

                <div className="flex flex-row min-w-full gap-12">
                    <TotalProfitCard balance="1000 DIN"></TotalProfitCard>
                    <TaxCard unpaidTax="2000" paidTax="340"></TaxCard>

                </div>
                <PortfolioTable></PortfolioTable>

            </main>
        </>
    )
}