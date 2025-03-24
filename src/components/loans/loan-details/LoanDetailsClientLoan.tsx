import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccount } from "@/types/bank-account.ts";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {Loan} from "@/types/loan.ts";
import {Installment} from "@/types/installment.ts";
import LoanDetailsClientLeft from "@/components/loans/loan-details/LoanDetailsClientLeft.tsx";
import LoanDetailsClientRight from "@/components/loans/loan-details/LoanDetailsClientRight.tsx";
import {getLoanInstallments} from "@/api/loan.ts";

interface DetailsProps extends React.ComponentProps<"div"> {
    loan: Loan;
    handleAccountInfoClick: (account: BankAccount) => void;
}



export default function LoanDetailsClientLoanCard ({
                                                                loan,
                                                              handleAccountInfoClick,
                                                              className,
                                                              ...props
                                                          }: DetailsProps) {


    const [lastInstallment, setLastInstallment] = useState<Installment | undefined>(undefined);

    const fetchLastInstallment = async () => {
        try{
            const data = await getLoanInstallments(loan.id, 1, 1);
            if(data.items && data.items.length > 0){
                setLastInstallment(data.items[0]);
            }
        }
        catch (error) {
            showErrorToast({error, defaultMessage:"Could not fetch last installment."})
        }
    }

    useEffect(() => {
        fetchLastInstallment();
    }, []);


    return (
        <Card
            className={cn(
                "h-full border-0 content-center",
                className
            )}
            {...props}
        >

            <CardHeader className="mb-2 flex flex-row items-center">
                <CardTitle className="font-heading text-2xl">Details</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-2 font-paragraph">
                <div className="flex lg:flex-row gap-8 md:flex-col flex-col">
                    <LoanDetailsClientLeft loan={loan} />
                    <LoanDetailsClientRight loan={loan} lastInstallment={lastInstallment} />
                </div>


                <Button size="sm" variant="outline"
                        className="absolute bottom-4 right-4"
                        onClick={(e) => handleAccountInfoClick(loan.account)}>
                    Account info
                    {/*<span className="icon-[ph--gear] text-base"></span>*/}
                </Button>

            </CardContent>

        </Card>
    );
};