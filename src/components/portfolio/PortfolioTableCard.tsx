import {BankAccount} from "@/types/bank-account.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import TransactionsDataTable from "@/components/bank-account/bank-account-single/TransactionsDataTable.tsx";
import PortfolioTable from "@/components/portfolio/PortfolioTable.tsx";
import React from "react";



export default function PortfolioTableCard() {

    return (
        <Card className={cn("border-0 content-center")}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl"> My assets </CardTitle>
            </CardHeader>
            <CardContent>
                <Card className="rounded-md font-paragraph" >
                    <PortfolioTable></PortfolioTable>
                </Card>
            </CardContent>
        </Card>
    )
}

