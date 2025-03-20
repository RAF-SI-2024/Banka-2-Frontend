import { Label } from "@/components/ui/label";
import React from "react";
import {formatCurrency} from "@/utils/format-currency.ts";
import {Loan} from "@/types/loan.ts";

interface DetailsProps extends React.ComponentProps<"div"> {
    loan: Loan;
}



export default function LoanDetailsClientLeft ({
                                    loan,
                                    className,
                                    ...props
                                }: DetailsProps) {


    return (
        <div className={className} {...props}>
            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Number:
                </Label>
                <div className="flex items-center gap-1 group">
                    <p className="text-xl font-medium">
                        {loan.id }
                    </p>
                </div>
            </div>


            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Type:
                </Label>
                <p className="text-xl font-medium">
                    {loan.type.name}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Total amount:
                </Label>
                <p className="text-xl font-medium">
                    {formatCurrency(loan.amount, loan.currency.code)}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Number of installments:
                </Label>
                <p className="text-xl font-medium">
                    {loan.period}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Agreement date:
                </Label>
                <p className="text-xl font-medium">
                    {(new Date(loan.createdAt)).toLocaleDateString('sr-RS')}
                </p>
            </div>
        </div>
    );
};