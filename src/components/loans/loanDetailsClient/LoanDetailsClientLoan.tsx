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
                {/*<Button size="icon" variant="ghost" onClick={onBackClick}>*/}
                {/*    <span className="icon-[ph--caret-left] size-6" />*/}
                {/*</Button>*/}
                <CardTitle className="font-heading text-2xl">Details</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-2 font-paragraph">


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