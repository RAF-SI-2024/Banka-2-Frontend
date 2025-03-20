import { Label } from "@/components/ui/label";
import React from "react";
import {formatCurrency} from "@/utils/format-currency.ts";
import {Installment, Loan} from "@/types/loan.ts";
import {formatPercentage} from "@/utils/format-number.ts";

interface DetailsProps extends React.ComponentProps<"div"> {
    loan: Loan;
    lastInstallment?: Installment;
}



export default function LoanDetailsClientRight ({
                                                   loan,
                                                    lastInstallment,
                                                   className,
                                                   ...props
                                               }: DetailsProps) {


    return (
        <div className={className} {...props}>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Nominal interest rate:
                </Label>
                <p className="text-xl font-medium">
                    {formatPercentage({amount: loan.nominalInstallmentRate/100})}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Effective interest rate:
                </Label>
                <div className="flex items-center gap-1 group">
                    <p className="text-xl font-medium">
                        {formatPercentage({amount: lastInstallment ? lastInstallment.interestRate/100: loan.nominalInstallmentRate})}
                    </p>
                </div>
            </div>


            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Next installment due date:
                </Label>
                <span className="my-auto icon-[ph--calendar] size-6 text-foreground"/>
                <div className="flex items-center gap-1 group">
                    <p className="text-xl font-medium">
                        {lastInstallment ? (new Date(lastInstallment.expectedDueDate)).toLocaleDateString('sr-RS'): "No installments yet"}
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Next installment amount
                </Label>
                <p className="text-xl font-semibold text-warning">
                    {formatCurrency(lastInstallment?.amount || 0, "RSD")}
                </p>
            </div>



        </div>
    );
};