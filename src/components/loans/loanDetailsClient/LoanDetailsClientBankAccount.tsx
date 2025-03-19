import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BankAccount } from "@/types/bankAccount";
import React, {useEffect, useState} from "react";
import {formatCurrency} from "@/utils/format-currency.ts";
import {Button} from "@/components/ui/button.tsx";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {getAccountById} from "@/api/bankAccount.ts";

interface DetailsProps extends React.ComponentProps<"div"> {
    account: BankAccount;
    handleAccountInfoClick: (account: BankAccount) => void;
}



export default function LoanDetailsClientBankAccountCard ({
                                    account,
                                     handleAccountInfoClick,
                                    className,
                                    ...props
                                }: DetailsProps) {

    const [fullAccount, setFullAccount] = useState<BankAccount | null>(null);

    const fetchAccount = async () => {
        try{
            const response = await getAccountById(account.id);

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

    if (!fullAccount) return <></>;

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
                <CardTitle className="font-heading text-2xl">Account details</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-2 font-paragraph">


                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Label:
                    </Label>
                        <div className="flex items-center gap-1 group">
                            {fullAccount.name  ?
                                <p className="text-xl font-medium">
                                    {fullAccount.name}
                                </p> :
                                <p className="text-xl font-medium text-muted-foreground">
                                    Unnamed
                                </p>
                            }
                        </div>
                </div>


                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Owner:
                    </Label>
                    <p className="text-xl font-medium">
                        {fullAccount.client.firstName} {fullAccount.client.lastName}
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Type:
                    </Label>
                    <p className="text-xl font-medium">
                        {fullAccount.type.name} ({fullAccount.type.code})
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Balance
                    </Label>
                    <p className="text-xl font-medium">
                        {formatCurrency(fullAccount.availableBalance, fullAccount.currency.code)}
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Reserved funds:
                    </Label>
                    <p className="text-xl font-medium">
                        {formatCurrency(0, fullAccount.currency.code)}
                    </p>
                </div>


                <Button size="sm" variant="outline"
                        className="absolute bottom-4 right-4"
                        onClick={(e) => handleAccountInfoClick(fullAccount)}>
                    Account info
                    {/*<span className="icon-[ph--gear] text-base"></span>*/}
                </Button>

            </CardContent>

        </Card>
    );
};