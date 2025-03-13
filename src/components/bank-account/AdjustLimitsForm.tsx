import React, {  useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {formatCurrency} from "@/utils/format-currency.ts";
import {BankAccount} from "@/types/bankAccount.ts";

interface AdjustLimitsFormProps {
    account: BankAccount;
    form: any,
    nextStep: () => void;
}

// Form Schema
export default function AdjustLimitsForm({account, form, nextStep }: AdjustLimitsFormProps) {
    const [monthlyLimitValue, setMonthlyLimitValue] = useState(formatCurrency(form.getValues("monthlyLimit"), account.currency.code));
    const [dailyLimitValue, setDailyLimitValue] = useState(formatCurrency(form.getValues("dailyLimit"), account.currency.code));


    const handleMonthlyLimitChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
        if (rawValue === "") rawValue = "0";

        const numericValue = parseFloat(rawValue) || 0;
        setMonthlyLimitValue(formatCurrency(numericValue)); // Format for display
        field.onChange(numericValue); // Pass raw value to form
    };

    const handleDailyLimitChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
        if (rawValue === "") rawValue = "0";

        const numericValue = parseFloat(rawValue) || 0;
        setDailyLimitValue(formatCurrency(numericValue)); // Format for display
        field.onChange(numericValue); // Pass raw value to form
    };

    return (
        <Card className={cn("flex flex-col gap-6")}>
            <CardContent className="mt-4 font-paragraph">
                <Form {...form}>
                    <form className="flex flex-col gap-6">
                        {/* Name Input */}

                        {/* Limit Input */}
                        <FormField
                            control={form.control}
                            name="dailyLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daily Limit</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="input"
                                            value={dailyLimitValue} // Show formatted value
                                            onChange={(e) => handleDailyLimitChange(e, field)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="monthlyLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Limit</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="input"
                                            value={monthlyLimitValue} // Show formatted value
                                            onChange={(e) => handleMonthlyLimitChange(e, field)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Submit Button */}
                        <Button type="button" variant="gradient" className="w-full" onClick={nextStep}>
                            Continue
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
