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
                    Total amount recieved:
                </Label>
                <p className="text-xl font-semibold text-success">
                    {formatCurrency(loan.amount, loan.currency.code)}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                    Total amount to be paid:
                </Label>
                <p className="text-xl font-semibold text-destructive">
                    {formatCurrency(loan.remainingAmount, loan.currency.code)}
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
                    Date of agreement:
                </Label>
                <span className="my-auto icon-[ph--calendar-check] size-6 text-foreground"/>
                <p className="text-xl font-medium">
                    {(new Date(loan.createdAt)).toLocaleDateString('sr-RS')}
                </p>
            </div>

            <div className="flex flex-row items-baseline gap-2">
                <Label htmlFor="label" className="text-xl font-light text-muted-foreground flex items-center gap-1">
                    Date of maturity:
                </Label>
                <span className="my-auto icon-[ph--calendar-heart] size-6 text-foreground"/>
                <div className="flex items-center gap-1 group">
                    <p className="text-xl font-medium">
                        {(new Date(loan.maturityDate)).toLocaleDateString('sr-RS')}
                    </p>
                </div>
            </div>
        </div>
    );
};