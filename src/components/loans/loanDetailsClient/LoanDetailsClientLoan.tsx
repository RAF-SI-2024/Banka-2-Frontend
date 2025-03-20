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
import LoanDetailsClientLeft from "@/components/loans/loanDetailsClient/LoanDetailsClientLeft.tsx";
import LoanDetailsClientRight from "@/components/loans/loanDetailsClient/LoanDetailsClientRight.tsx";

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

    const [fullAccount, setFullAccount] = useState<BankAccount | null>(null);

    const fetchAccount = async () => {
        try{
            const response = await getAccountById(loan.account.id);

            if(response.status !== 200){
                throw new Error("Failed to fetch bank account info");
            }

            console.log(response.data);

            setFullAccount(response.data);
        }
        catch (error) {
            showErrorToast({error, defaultMessage:"Failed to fetch bank account info."})
        }
    }

    useEffect(() => {
        fetchAccount();
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
                    <LoanDetailsClientRight loan={loan} />
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