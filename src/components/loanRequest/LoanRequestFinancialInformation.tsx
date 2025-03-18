import React from "react";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card.tsx";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export default function LoanRequestFinancialInformation() {
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
                    <div className="flex flex-col gap-8 md:flex md:flex-row  md:gap-4">
                        <FormField
                            key="loanType"
                            name="loanType"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Loan type</FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a loan type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Type 1">
                                                    Type 1
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <FormField
                            key="numInstallments"
                            name="numInstallments"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Number of installments</FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a loan type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Type 1">
                                                    Type 1
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                    </div>

                    <FormField
                        key="interestRateType"
                        name="interestRateType"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2 md:pr-2">
                                <FormLabel>Interest rate type</FormLabel>
                                <FormControl>
                                    <Select {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a loan type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Type 1">
                                                Type 1
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}