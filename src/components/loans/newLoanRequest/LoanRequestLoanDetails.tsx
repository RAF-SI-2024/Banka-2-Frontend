import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card.tsx";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {LoanType} from "@/types/loanType.ts";
import {InterestType} from "@/types/enums.ts";


interface LoanRequestLoanDetailsProps{
    loanTypes: LoanType[];
}

export default function LoanRequestLoanDetails({loanTypes}: LoanRequestLoanDetailsProps) {
    const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(null);

    // Define installment options based on selected loan type
    const installmentOptions =
        selectedLoanType?.id === "6302513e-9bf2-4de0-abdf-93bad3e20a35"
            ? [60, 120, 180, 240, 300, 360]
            : [12, 24, 36, 48, 60, 72, 84];


    return (
        <div className="flex flex-col">
            <h2 className="font-heading font-medium text-3xl inline-flex items-center w-full pb-4 gap-2">
                <span className="icon-[ph--bank] inline-flex items-center"></span>
                Loan details
            </h2>
            <Card className="  border-0">
                <CardHeader>
                    <CardDescription>Help us understand the specifics of the loan you are applying for.</CardDescription>
                </CardHeader>
                <CardContent className=" font-paragraph flex flex-col gap-8">
                    <div className="flex flex-col gap-8 md:flex md:flex-row  md:gap-4 items-baseline">
                        <FormField
                            key="loanType"
                            name="loanType"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Loan type</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={selectedLoanType?.id || ""}
                                            onValueChange={(value) => {
                                                const loanType = loanTypes.find((lt) => lt.id === value) || null;
                                                setSelectedLoanType(loanType);
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a loan type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loanTypes.map((loanType) => (
                                                    <SelectItem key={loanType.id} value={loanType.id}>
                                                        {loanType.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>Choose the type of loan that best fits your needs</FormDescription>
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
                                        <Select {...field} onValueChange={(value) => { field.onChange(value);}}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select number of installments" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {installmentOptions.map((option) => (
                                                    <SelectItem key={option} value={option.toString()}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Indicate the number of payments over which you want to repay the loan
                                    </FormDescription>
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
                                    <Select {...field} onValueChange={(value) => { field.onChange(value);}}>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={InterestType.Fixed.toString()}>
                                                {InterestType[InterestType.Fixed]}
                                            </SelectItem>
                                            <SelectItem value={InterestType.Variable.toString()}>
                                                {InterestType[InterestType.Variable]}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>Select whether you prefer a fixed or variable interest rate.</FormDescription>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}