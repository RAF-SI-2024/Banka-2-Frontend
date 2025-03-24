import * as React from "react";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import { PhoneInput } from "@/components/__common__/input/PhoneInput.tsx"
import { onSubmitEmployee} from "@/components/register/RegisterRequests.tsx";
import Stepper from "@/components/__common__/Stepper.tsx";


// @ts-expect-error Need to add type to the props
export default function RegisterFormSecondEmployee({ prevStep, nextStep, form, className, ...props }) {

    async function goToNextStepEmployee() {
        const isValid = await form.trigger([
            "email",
            "username",
            "phoneNumber",
            "address",
            "department",
            "employed",
        ]);

        if (isValid) {
            await onSubmitEmployee({form, nextStep});
        }
    }


    return (
        <>
            <h1 className="scroll-m-20 text-5xl font-heading tracking-tight z-0 relative text-center">
                Create employee's account </h1>
            <div className="w-full max-w-md z-10 relative">
                <Card className={cn("flex flex-col gap-6 mb-6 size-full bg-transparent border-0", className)} {...props}>
                    <CardHeader className="pb-0">
                        <Stepper totalSteps={4} currentStep={2} className="w-full h-10 justify-center"/>
                    </CardHeader>
                    <CardContent className="mt-4 font-paragraph">
                        <Form {...form}>
                            <form className="flex flex-col gap-6">
                                {/* First name field */}

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example123" id="username" type="text"
                                                       required={true} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@example.com" id="email" type="text"
                                                       required={true} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col items-start">
                                            <FormLabel className="text-left">Phone Number</FormLabel>
                                            <FormControl className="w-full">
                                                <PhoneInput placeholder="Enter a phone number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, City, Country" id="address"
                                                       type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Department" id="department" type="text"
                                                       required={true} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                <div className="flex flex-row gap-4 mt-4">
                                    <Button type="submit" variant="negative" className="w-24"
                                            onClick={prevStep}>
                                        Back
                                    </Button>
                                    <Button type="button" variant="default" className="w-24"
                                            onClick={goToNextStepEmployee}>
                                        Continue
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>


    );
}