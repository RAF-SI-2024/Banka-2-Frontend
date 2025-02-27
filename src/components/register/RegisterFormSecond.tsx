import * as React from "react";
import {useState} from "react";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import { PhoneInput } from "@/components/common/PhoneInput.tsx"
import {RegisterRequestClient, RegisterRequestEmployee} from "@/types/auth.ts";
import {registerClient, registerEmployee} from "@/api/auth.ts";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";
import {Role} from "@/types/enums.ts";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';


// @ts-expect-error Need to add type to the props
export default function RegisterFormSecond({ setStep, prevStep, nextStep, form, className, ...props }) {
    const [error, setError] = useState<{ id: number; title: string; description: string } | null>(null);
    async function goToNextStepClient() {
        const isValid = await form.trigger([
            "email",
            "phoneNumber",
            "address",
        ]);
        if (isValid) {
            await onSubmitClient();
        }
    }

    async function onSubmitClient() {
        nextStep()
        setError(null);
        try {
            const registerData: RegisterRequestClient = {
                email: form.getValues("email"),
                firstName: form.getValues("firstName"),
                lastName: form.getValues("lastName"),
                dateOfBirth: format(new Date(form.getValues("dateOfBirth")), "yyyy-MM-dd"),
                uniqueIdentificationNumber: form.getValues("uniqueIdentificationNumber"),
                gender: parseInt(form.getValues("gender"), 10), // Convert string to number
                phoneNumber: form.getValues("phoneNumber"),
                address: form.getValues("address"),
                role: Role.Client,
            };


            const response = await registerClient(registerData);

            if (response.status === 200) {
                // console.log("NEXT STEP");
                nextStep();
            }


        } catch (error) {
            console.error("Register for client failed:", error);
            setError({
                id: Date.now(),
                title: "Failed to log in",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),
            });
        } finally {
            console.log("FINALLY STEP");
        }
    }

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
            await onSubmitEmployee()
        }
    }

    async function onSubmitEmployee() {
        setError(null);
        try {
            const registerData: RegisterRequestEmployee = {
                username: form.getValues("username"),
                department: form.getValues("department"),
                email: form.getValues("email"),
                firstName: form.getValues("firstName"),
                lastName: form.getValues("lastName"),
                dateOfBirth: format(new Date(form.getValues("dateOfBirth")), "yyyy-MM-dd"),
                uniqueIdentificationNumber: form.getValues("uniqueIdentificationNumber"),
                gender: parseInt(form.getValues("gender"), 10), // Convert string to number
                phoneNumber: form.getValues("phoneNumber"),
                address: form.getValues("address"),
                role: Role.Employee,
            };

            const response = await registerEmployee(registerData);
            if (response.status === 200) {
                // console.log("NEXT STEP");
                nextStep();
            }

        } catch (error) {
            console.error("Register for employee failed:", error);
            setError({
                id: Date.now(),
                title: "Failed to register employee",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),
            });
        }
    }

    return (
        <>
            <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative text-center">
                Create your account </h1>
            <div className="w-full max-w-md z-10 relative">
                <Tabs defaultValue="client" className="w-xl max-w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="client">Client</TabsTrigger>
                        <TabsTrigger value="employee">Employee</TabsTrigger>
                    </TabsList>
                    <TabsContent value="client">
                        <Card className={cn("flex flex-col gap-6 mb-6", className)} {...props}>
                            <CardContent className="mt-4 font-paragraph">
                                <Form {...form}>
                                    <form className="flex flex-col gap-6">
                                        {/* First name field */}

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

                                        <div className="flex flex-row gap-4">
                                            <Button type="button" variant="negative" className="w-24"
                                                    onClick={prevStep}>
                                                Back
                                            </Button>
                                            <Button type="button" variant="default" className="w-24"
                                                    onClick={goToNextStepClient}>
                                                Continue
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        {error && [error].map((error) => (
                            <ErrorAlert
                                key={error.id}
                                title={error.title}
                                description={error.description}
                                onClose={() => setError(null)}
                            />
                        ))}
                    </TabsContent>

                    <TabsContent value="employee">
                        <Card className={cn("flex flex-col gap-6 mb-6", className)} {...props}>
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
                        {error && [error].map((error) => (
                            <ErrorAlert
                                key={error.id}
                                title={error.title}
                                description={error.description}
                                onClose={() => setError(null)}
                            />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
            </>


            );
            }