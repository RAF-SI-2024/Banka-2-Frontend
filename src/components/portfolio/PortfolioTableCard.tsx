import {BankAccount} from "@/types/bank_user/bank-account.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import TransactionsDataTable from "@/components/bank-account/bank-account-single/TransactionsDataTable.tsx";
import PortfolioTable from "@/components/portfolio/PortfolioTable.tsx";
import React from "react";



export default function PortfolioTableCard({className} : React.ComponentProps<"div">) {

    return (
        <Card className={cn("border-0 content-center", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl"> My assets </CardTitle>
            </CardHeader>
            <CardContent>

                    <PortfolioTable></PortfolioTable>

            </CardContent>
        </Card>
    )
}

