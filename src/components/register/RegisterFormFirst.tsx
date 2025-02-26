import * as React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth.ts";
import { LoginRequest } from "@/types/auth.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";


// @ts-ignore
export default function RegisterFormFirst({ form, nextStep, className, ...props }) {

    const [error, setError] = useState<string | null>(null);

    function onSubmit(){}


    function handleFormClick() {
        console.log("Form data:", form.getValues());
    }


    return (
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
            <CardContent className="mt-4 font-paragraph">
                {error && <p className="text-red-500">{error}</p>}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} onClick={handleFormClick} className="flex flex-col gap-4">
                        {/* First name field */}
                        <div className="flex flex-row gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jon" id="firstName" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" id="lastName" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of birth</FormLabel>
                                <FormControl>
                                    <Input placeholder="Pick a date" id="dateOfBirth" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="uniqueIdentificationNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>National ID Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter ID number" id="uniqueIdentificationNumber" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="gender" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 flex-row mt-2">
                                        <FormItem className="flex flex-row">
                                            <RadioGroupItem value="0" />
                                            <FormLabel>Male</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex flex-row">
                                            <RadioGroupItem value="1" />
                                            <FormLabel>Female</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" variant="default" className="w-1/3" onClick={nextStep}>
                            Continue
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

