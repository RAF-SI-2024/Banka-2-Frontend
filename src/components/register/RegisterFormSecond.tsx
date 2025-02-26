import * as React from "react";
import {useState} from "react";
import * as z from "zod"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import {Tabs, TabsList, TabsContent, TabsTrigger} from "@/components/ui/tabs.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'

// @ts-ignore
export default function RegisterFormSecond({ nextStep, prevStep, form, className, ...props }) {
    const [error, setError] = useState<string | null>(null);

    function blank(){}

    function click() {
        console.log(form.getValues())
    }

    function handleFormClick() {
        console.log("Form data:", form.getValues());
    }

    return (

        <Tabs defaultValue="client" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="employee">Employee</TabsTrigger>
            </TabsList>
            <TabsContent value="client">
                <Card className={cn("flex flex-col gap-6", className)} onClick={handleFormClick} {...props}>
                    <CardContent className="mt-4 font-paragraph">
                        {error && <p className="text-red-500">{error}</p>} {/* Display errors */}
                        <Form {...form}>
                            <form onSubmit={blank} className="flex flex-col gap-6" onClick={click}>
                                {/* First name field */}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@example.com" id="email" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-start">
                                            <FormLabel className="text-left">Phone Number</FormLabel>
                                            <FormControl className="w-full">
                                                <PhoneInput
                                                    placeHolder="061 2345 678"
                                                    className="w-full max-w-md border border-gray-700 rounded-md p-2"
                                                    dropdownClassName="bg-white shadow-lg rounded-md border border-gray-800 p-2"
                                                    buttonClassName="border-r border-gray-300 pr-2"
                                                    defaultCountry="RS"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, City, Country" id="address" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-row gap-4">
                                    <Button type="submit" variant="negative" className="w-24" onClick={prevStep}>
                                        Back
                                    </Button>
                                    <Button type="submit" variant="default" className="w-24" onClick={nextStep}>
                                        Continue
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="employee">
                <Card className={cn("flex flex-col gap-6", className)} {...props}>
                    <CardContent className="mt-4 font-paragraph">
                        {error && <p className="text-red-500">{error}</p>} {/* Display errors */}
                        <Form {...form}>
                            <form onSubmit={blank} className="flex flex-col gap-6" onClick={click}>
                                {/* First name field */}

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example123" id="username" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@example.com" id="email" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-start">
                                            <FormLabel className="text-left">Phone Number</FormLabel>
                                            <FormControl className="w-full">
                                                <PhoneInput
                                                    placeHolder="061 2345 678"
                                                    className="w-full max-w-md border border-gray-700 rounded-md p-2"
                                                    dropdownClassName="bg-white shadow-lg rounded-md border border-gray-800 p-2"
                                                    buttonClassName="border-r border-gray-300 pr-2"
                                                    defaultCountry="RS"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, City, Country" id="address" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Department" id="department" type="text" required={true} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="employed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Are you currently employed</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 flex-row mt-2">
                                                    <FormItem className="flex flex-row">
                                                        <RadioGroupItem value="1" />
                                                        <FormLabel>Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex flex-row">
                                                        <RadioGroupItem value="0" />
                                                        <FormLabel>No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <div className="flex flex-row gap-4 mt-4">
                                    <Button type="submit" variant="negative" className="w-24" onClick={prevStep}>
                                        Back
                                    </Button>
                                    <Button type="submit" variant="default" className="w-24" onClick={nextStep}>
                                        Continue
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>


    );
}