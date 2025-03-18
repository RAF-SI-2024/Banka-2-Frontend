import React from "react";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card.tsx";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";
import {PhoneInput} from "@/components/common/input/PhoneInput.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";

export default function LoanRequestPersonalInfo() {
    return (
        <div className="flex flex-col">
            <h2 className="font-heading font-medium text-3xl inline-flex items-center w-full pb-4 gap-2">
                <span className="icon-[ph--user-check] inline-flex items-center"></span>
                Personal information
            </h2>
            <Card className="  border-0">
                <CardHeader>
                    <CardDescription>We need some details about your financial situation to assess your eligibility.</CardDescription>
                </CardHeader>
                <CardContent className=" font-paragraph flex flex-col gap-8">
                    <FormField
                        key="phoneNumber"
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2 md:pr-2">
                                <FormLabel>Contact phone number</FormLabel>
                                <FormControl>
                                    <PhoneInput {...field}/>
                                </FormControl>
                                <FormMessage />
                                <FormDescription>Enter your phone number</FormDescription>
                            </FormItem>

                        )}
                    />
                    <FormField
                        key="employmentStatus"
                        name="employmentStatus"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2 md:pr-2">
                                <FormLabel>Employment status</FormLabel>
                                <FormControl>
                                    <Select {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your employment status" className="text-ellipsis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Permanently employed">
                                                Permanently employed
                                            </SelectItem>
                                            <SelectItem value="Temporarily employed">
                                                Temporarily employed
                                            </SelectItem>
                                            <SelectItem value="Unemployed">
                                                Unemployed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>What's your employment status?</FormDescription>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <div className="flex flex-col gap-8 md:flex md:flex-row  md:gap-4 items-baseline">
                        <FormField
                            key="employmentStatus"
                            name="employmentStatus"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-2 ">
                                    <FormLabel>Employment period</FormLabel>
                                    <FormControl>
                                       <Input {...field} placeholder="Enter your employment period"></Input>
                                    </FormControl>
                                    <FormDescription>How long have you been employed?</FormDescription>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <FormField
                            key="monthlySalary"
                            name="monthlySalary"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-2">
                                    <FormLabel>Monthly salary</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            currency={"RSD"}
                                            onChange={field.onChange}
                                            defaultValue={0}
                                        />
                                    </FormControl>
                                    <FormDescription>Enter your monthly income before taxes</FormDescription>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}