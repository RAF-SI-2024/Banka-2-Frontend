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
import {BankAccount} from "@/types/bank-account.ts";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {CardDTO} from "@/types/card.ts";

interface AdjustLimitsFormProps {
    card: CardDTO;
    form: any,
    nextStep: () => void;
}

// Form Schema
export default function BankCardAdjustLimisForm({card, form, nextStep }: AdjustLimitsFormProps) {
    return (
        <Card className={cn("flex flex-col gap-6 bg-transparent border-0 shadow-none")}>
            <CardContent className="mt-4 font-paragraph">
                <h2 className="text-2xl font-heading font-semibold text-center mt-4 mb-8">Adjust limits</h2>
                <Form {...form}>
                    <form className="flex flex-col gap-6">
                        {/* Name Input */}

                        {/* Limit Input */}
                        <FormField
                            key="limit"
                            control={form.control}
                            name="limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Limit</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            defaultValue={card.limit}
                                            id="limit"
                                            currency={card.account.currency.code}
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
