import React from "react";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card.tsx";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {BankAccount} from "@/types/bankAccount.ts";

interface LaonRequestFinancialInformationProps {
    bankAccounts: BankAccount[];
}
export default function LoanRequestFinancialInformation({bankAccounts}: LaonRequestFinancialInformationProps) {
    return (
        <div className="flex flex-col">
            <h2 className="font-heading font-medium text-3xl inline-flex items-center w-full pb-4 gap-2">
                <span className="icon-[ph--piggy-bank] inline-flex items-center"></span>
                Financial information
            </h2>
            <Card className="  border-0">
                <CardHeader>
                    <CardDescription>Explain the amount you need and how the funds will be handled.</CardDescription>
                </CardHeader>
                <CardContent className=" font-paragraph flex flex-col gap-8">

                    <FormField
                        key="accountNumber"
                        name="accountNumber"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2 md:pr-2">
                                <FormLabel>Bank account</FormLabel>
                                <FormControl>
                                    <Select {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a bank account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bankAccounts.map((bankAccount) => (
                                                <SelectItem key={bankAccount.id} value={bankAccount.id}>
                                                    {bankAccount.accountNumber} {"(" + bankAccount.currency.code + ")"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Provide the account where the approved loan funds should be deposited.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        key="amount"
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2 md:pr-2">
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <MoneyInput
                                        currency={"RSD"} //TODO CHANGE  TO BANK ACCOUNT CURRENCY || RSD
                                        onChange={field.onChange}
                                        min={1000}
                                        max={100000000}
                                        defaultValue={100000}
                                    />
                                </FormControl>
                                <FormDescription>Enter your requested loan amount</FormDescription>
                                <FormMessage />
                            </FormItem>

                        )}
                    />

                    <FormField
                        key="purpose"
                        name="purpose"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purpose</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter the purpose of the loan"
                                    />

                                </FormControl>
                                <FormDescription>Let us know how you plan to use the loan (e.g., home renovation, debt consolidation)</FormDescription>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}