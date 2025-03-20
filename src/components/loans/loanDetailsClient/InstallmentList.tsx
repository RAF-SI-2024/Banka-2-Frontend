import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BankAccount } from "@/types/bankAccount";
import React, {useEffect, useState} from "react";
import {formatCurrency} from "@/utils/format-currency.ts";
import {Button} from "@/components/ui/button.tsx";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {getAccountById} from "@/api/bankAccount.ts";
import {Loan} from "@/types/loan.ts";
import InstallmentTable from "@/components/loans/loanDetailsClient/InstallmentTable.tsx";

interface DetailsProps extends React.ComponentProps<"div"> {
    loanId: string;
}



export default function InstallmentListCard ({
                                                       loanId,
                                                       className,
                                                       ...props
                                                   }: DetailsProps) {



    return (
        <Card
            className={cn(
                "h-full border-0 content-center",
                className
            )}
            {...props}
        >

            <CardHeader className="mb-2 flex flex-row items-center">
                {/*<Button size="icon" variant="ghost" onClick={onBackClick}>*/}
                {/*    <span className="icon-[ph--caret-left] size-6" />*/}
                {/*</Button>*/}
                <CardTitle className="font-heading text-2xl">Installment history</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-2 font-paragraph">

            <InstallmentTable loanId={loanId} />


            </CardContent>

        </Card>
    );
};