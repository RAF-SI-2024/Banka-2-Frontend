import React from "react";
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
import {BankAccount} from "@/types/bankAccount.ts";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";

interface AdjustLimitsFormProps {
    account: BankAccount;
    form: any,
    nextStep: () => void;
}

// Form Schema
export default function AdjustLimitsForm({account, form, nextStep }: AdjustLimitsFormProps) {
    return (
        <Card className={cn("flex flex-col gap-6 bg-transparent border-0")}>
            <CardContent className="mt-4 font-paragraph">
                <h2 className="text-2xl font-heading font-semibold text-center mt-4 mb-8">Adjust limits</h2>
                <Form {...form}>
                    <form className="flex flex-col gap-6">
                        {/* Name Input */}

                        {/* Limit Input */}
                        <FormField
                            key="dailyLimit"
                            control={form.control}
                            name="dailyLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daily Limit</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            defaultValue={account.dailyLimit}
                                            id="daiilyLimit"
                                            currency={account.currency.code}
                                            onChange={field.onChange}
                                            min={1000}
                                            max={10000000}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            key="monthlyLimit"
                            control={form.control}
                            name="monthlyLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Limit</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            defaultValue={account.monthlyLimit}
                                            id="monthlyLimit"
                                            currency={account.currency.code}
                                            onChange={field.onChange}
                                            min={1000}
                                            max={10000000}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Submit Button */}
                        <Button type="button" variant="gradient" className="w-fit" onClick={nextStep}>
                            Continue
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
