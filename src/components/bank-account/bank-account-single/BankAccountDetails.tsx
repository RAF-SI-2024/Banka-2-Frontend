import { cn } from "@/lib/utils.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { BankAccount } from "@/types/bank-account.ts";
import React, { useState} from "react";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import BankAccountDetailsAdjustLimitsDialog from "@/components/bank-account/bank-account-single/BankAccountDetailsAdjustLimitsDialog.tsx";

interface DetailsProps extends React.ComponentProps<"div"> {
    account: BankAccount;
    onBackClick: () => void;
    onAccountNameChange: (newName: string) => Promise<boolean>;
}

const accountNameSchema = z.string()
    .min(3, "Account name must be at least 3 characters long")
    .max(64, "Account name must be less than 64 characters long")
    .regex(/^\S+$/, "Account name cannot contain spaces");


const BankAccountDetailsCard = ({
                                    account,
                                    onBackClick,
                                    onAccountNameChange,
                                    className,
                                    ...props
                                }: DetailsProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [accountName, setAccountName] = useState(account?.name ?? "");
    const [isValid, setIsValid] = useState(true); // Tracks if the name is valid
    const [isAdjustLimitsDialogOpen, setAdjustLimitsDialogOpen] = useState(false);
    const [monthlyLimit, setMonthlyLimit] = useState(account?.monthlyLimit ?? 0);
    const [dailyLimit, setDailyLimit] = useState(account?.dailyLimit ?? 0);

    const handleToggleEdit = async () => {
        if (isEditing) {
            // Final validation when leaving edit mode
            const result = accountNameSchema.safeParse(accountName);
            setIsValid(result.success);
            if (result.success) {
                try {
                    const res = await onAccountNameChange(accountName); // Wait for async function
                    if (!res) {
                        setAccountName(account.name);
                        console.log(accountName);
                    }
                } catch (error) {
                    console.error("Failed to update account name", error);
                    setAccountName(account.name); // Reset name on failure
                }
            } else {
                return; // Don't exit edit mode if invalid
            }
        }
        setIsEditing(!isEditing);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setAccountName(newName);

        // Validate while typing
        const result = accountNameSchema.safeParse(newName);
        setIsValid(result.success);
    };

    const handleAdjustLimitsClick = () => {
        setAdjustLimitsDialogOpen(true);
    };


    return (
        <Card
            className={cn(
                "h-full border-0 content-center",
                className
            )}
            {...props}
        >

            <CardHeader className="mb-2 flex flex-row -ml-4 items-center">
                <Button size="icon" variant="ghost" onClick={onBackClick}>
                    <span className="icon-[ph--caret-left] size-6" />
                </Button>
                <CardTitle className="font-heading text-2xl">Account details</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-2 font-paragraph">


                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Label:
                    </Label>

                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={accountName}
                                onChange={handleNameChange}
                                onBlur={handleToggleEdit}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleToggleEdit();
                                    }
                                }}
                                className={cn(
                                    "text-xl font-medium border-b w-full focus:outline-none focus:ring-0 transition-all duration-200",
                                    isValid ? "border-muted-foreground focus:border-primary" : "border-destructive focus:border-destructive"
                                )}
                                />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 group">
                            {accountName  ?
                                <p className="text-xl font-medium">
                                    {accountName}
                                </p> :
                                <p className="text-xl font-medium text-muted-foreground">
                                    Unnamed
                                </p>
                            }

                            <Button
                                variant="ghost"
                                className="icon-[ph--pencil-fill] w-4 h-4 text-muted-foreground cursor-pointer"
                                onClick={handleToggleEdit}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Number:
                    </Label>
                    <p className="text-xl font-medium">
                        {account.accountNumber}
                    </p>
                </div>


                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Owner:
                    </Label>
                    <p className="text-xl font-medium">
                        {account.client.firstName} {account.client.lastName}
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Type:
                    </Label>
                    <p className="text-xl font-medium">
                        {account.type.name} ({account.type.code})
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Reserved funds:
                    </Label>
                    <p className="text-xl font-medium">
                        {formatCurrency(0, account.currency.code)}
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Monthly limit:
                    </Label>
                    <p className="text-xl font-medium">
                        {formatCurrency(monthlyLimit, account.currency.code)}
                    </p>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                    <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
                        Daily limit:
                    </Label>
                    <p className="text-xl font-medium">
                        {formatCurrency(dailyLimit, account.currency.code)}
                    </p>
                </div>
                <Button size="sm" variant="outline" className="absolute bottom-4 right-4" onClick={handleAdjustLimitsClick}>
                    Adjust limits
                    <span className="icon-[ph--gear] text-base"></span>
                </Button>

                <BankAccountDetailsAdjustLimitsDialog account={account}
                                                      showDialog={isAdjustLimitsDialogOpen}
                                                      setShowDialog={setAdjustLimitsDialogOpen}
                                                      setMonthlyLimit={setMonthlyLimit}
                                                      setDailyLimit={setDailyLimit}/>
            </CardContent>

        </Card>
    );
};

export default BankAccountDetailsCard;
