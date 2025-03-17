import React, { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {getCardTypes} from "@/api/card.ts";
import {BankAccount} from "@/types/bankAccount.ts";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";

interface CreateCardProps {
    account: BankAccount,
    form: any,
    nextStep: () => void;
}

// Form Schema
export default function CreateCardForm({account, form, nextStep }: CreateCardProps) {
    const [types, setTypes] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        // Fetch account types from API
        async function fetchTypes() {
            try {
                const response =  await getCardTypes(); // Replace with actual API URL
                if (response.status !== 200){
                    throw new Error(response.statusText);
                }
                const data = response.data.items;
                setTypes(data);
            } catch (error) {
                console.error("Failed to fetch account types", error);
            }
        }

        fetchTypes();
    }, []);


    return (
        <Card className={cn("flex flex-col gap-6 bg-transparent border-0")}>
            <CardContent className="mt-4 font-paragraph">
                <h2 className="text-2xl font-heading font-semibold text-center mt-4 mb-8">Create a new card</h2>
                <Form {...form}>
                    <form className="flex flex-col gap-6">
                        {/* Name Input */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Name</FormLabel>
                                    <FormControl>
                                        <Input id="name" className="input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Account Type Select */}
                        <FormField
                            control={form.control}
                            name="cardTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an account type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {types.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Limit Input */}
                        <FormField
                            control={form.control}
                            name="limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Limit</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            id="limit"
                                            currency={account.currency.code}
                                            onChange={field.onChange}
                                            min={1000}
                                            max={10000000}
                                            defaultValue={100000}
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
