import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityCodeDropdown from "@/components/createBankAccount/ActivityCodeDropdown.tsx";
import RadioGroupSelector from "@/components/createBankAccount/RadioGroupSelector.tsx";
import PlanSelect from "@/components/createBankAccount/PlanSelect.tsx";
import CurrencySelect from "@/components/createBankAccount/CurrencySelect.tsx";
import TypeSelect from "@/components/createBankAccount/TypeSelect.tsx";
import OwnershipSelect from "@/components/createBankAccount/OwnershipSelect.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

const businessInfoSchema = z.object({
    businessName: z.string()
        .min(1, "Business name is required")
        .max(32, "Business name must be at most 32 characters")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
    registrationNumber: z.string()
        .length(9, "Must be exactly 9 digits long")
        .regex(/^\d{9}$/, "Unique identification number must contain only numbers"),
    pib: z.string()
        .length(9, "Must be exactly 9 digits long")
        .regex(/^\d{9}$/, "PIB must contain only numbers"),
    activityCode: z.string().min(1, { message: "Activity Code is required" }),
    address: z.string()
        .min(5, "Address is required")
        .regex(/^[0-9A-Za-zčČćĆžŽšŠđĐ /]+$/, "Only letters, numbers, spaces and / are allowed"),
    majorityOwner: z.string()
        .min(1, "Majority owner name is required")
        .max(32, "Majority owner name must be at most 32 characters")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
});

const emailSchema = z.object({ email: z.string().email({ message: "Invalid email format" }) });
type EmailInfo = z.infer<typeof emailSchema>;
type BusinessInfo = z.infer<typeof businessInfoSchema>;

export default function CreateAccountPage() {
    const location = useLocation();
    const { step2 } = location.state || {};
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState("new");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [ownership, setOwnership] = useState("Personal");
    const [creditCard, setCreditCard] = useState("yes");
    const [type, setType] = useState("Current Account");
    const [selectedCurrency, setSelectedCurrency] = useState("EUR");
    const [plan, setPlan] = useState(ownership === "Business" ? "DOO" : "Standard");
    const [emailError, setEmailError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.step2) {
            setStep(location.state.step2);
        }
    }, [location.state]);

    const handleContinueClick = () => {
        if (selectedOption === "new") {
            navigate("/register");
        } else if (selectedOption === "existing") {
            try {
                emailSchema.parse(email);
                setEmailError(null);
                setStep(step + 1);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setEmailError(error.errors[0].message);
                } else {
                    setEmailError("An unexpected error occurred.");
                }
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    useEffect(() => {
        if (ownership === "Business") {
            setPlan("DOO");
        } else {
            setPlan("Standard");
        }
    }, [ownership]);

    // useForm za Business Information (korak 3)
    const businessForm = useForm<BusinessInfo>({
        resolver: zodResolver(businessInfoSchema),
        mode: "onChange",
        defaultValues: {
            businessName: "",
            registrationNumber: "",
            pib: "",
            activityCode: "",
            address: "",
            majorityOwner: "",
        },
    });

    const emailForm = useForm<EmailInfo>({
        resolver: zodResolver(emailSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    // Kreiramo form instance za step 2, npr. sa početnim vrednostima
    const accountForm = useForm({
        defaultValues: {
            accountType: type,
            ownership: ownership,
            plan: plan,
            currency: selectedCurrency,
        },
    });


    const onBusinessSubmit = (data: BusinessInfo) => {
        console.log("Business Information:", data);
        if (type === "Current Account") {
            console.log("Sending request to create a business current account...");
        } else {
            console.log("Sending request to create a business exchange account...");
        }
    };


    //  NE BRISATI OVO!! 
    //
    // const handleFinishOrContinue = () => {
    //     if (type === "Current Account" && ownership === "Personal") {
    //         // TODO: Implement personal current account creation route
    //         console.log("Sending request to create a personal current account...");
    //     } else if (type === "Foreign Exchange Account" && ownership === "Personal") {
    //         // TODO: Implement personal exchange account creation route
    //         console.log("Sending request to create a personal exchange account...");
    //     } else if (
    //         (type === "Current Account" && ownership === "Business") ||
    //         (type === "Foreign Exchange Account" && ownership === "Business")
    //     ) {
    //         if (step === 3) {
    //             // Pokrećemo submit business forme
    //             businessForm.handleSubmit(onBusinessSubmit)();
    //         } else {
    //             setStep(step + 1);
    //         }
    //     }
    // };

    const handleFinishOrContinue = () => {
        if (ownership === "Personal") {

            if (type === "Current Account") {
                // TODO: Implement personal current account creation route
            } else {
                // TODO: Implement personal exchange account creation route
            }
        } else {
            if (type === "Current Account") {
                // TODO: Implement business current account creation route
            } else if (type === "Foreign Exchange Account") {
                // TODO: Implement business exchange account creation route
            }

            if (step === 3) {
                // Pokrećemo submit business forme
                businessForm.handleSubmit(onBusinessSubmit)();
            } else {
                setStep(step + 1);
            }
        }
    };

    const handlePlanChange = (value: string) => {
        setPlan(value);
    };

    const handleOwnershipChange = (value: string) => {
        setOwnership(value);
        setPlan(value === "Business" ? "DOO" : "Standard");
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            {step === 1 && (
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <span className="icon-[ph--user-circle-plus-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl mt-5" />
                            <h2 className="text-xl font-semibold">Register client account?</h2>
                        </div>
                        <CardDescription className="mt-4" >
                            Does your client already have an account? Do you wish to register a new client account or use an existing one?
                        </CardDescription>
                        <RadioGroupSelector selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                        {selectedOption === "existing" && (
                            <Form {...emailForm}>
                                <form
                                    onSubmit={emailForm.handleSubmit((data) => {
                                        console.log("Email Information:", data);
                                        setStep(step + 1);
                                    })}
                                    className="space-y-4 mt-4"
                                >
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="example@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-center w-full mt-4">
                                        <Button type="submit" className="w-full" variant="default">
                                            Continue
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                        {selectedOption === "new" && (
                            <Button variant="outline" className="w-full mt-6" onClick={handleContinueClick}>
                                Continue
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card className="mt-4">
                    <CardContent>
                        <Form {...accountForm}>
                            <form
                                onSubmit={accountForm.handleSubmit((data) => {
                                    console.log("Account Information:", data);
                                })}
                                className="flex flex-col gap-4 mt-6"
                            >
                                <FormField
                                    control={accountForm.control}
                                    name="accountType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <FormControl>
                                                <TypeSelect type={type} setType={setType} {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {type === "Current Account" ? (
                                    <div className="flex gap-4 w-full ">
                                        <FormField
                                            control={accountForm.control}
                                            name="ownership"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Ownership</FormLabel>
                                                    <FormControl>
                                                        <OwnershipSelect
                                                            ownership={ownership}
                                                            handleOwnershipChange={handleOwnershipChange}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountForm.control}
                                            name="plan"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Plan</FormLabel>
                                                    <FormControl>
                                                        <PlanSelect
                                                            plan={plan}
                                                            handlePlanChange={handlePlanChange}
                                                            ownership={ownership}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <FormField
                                            control={accountForm.control}
                                            name="ownership"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ownership</FormLabel>
                                                    <FormControl>
                                                        <OwnershipSelect
                                                            ownership={ownership}
                                                            handleOwnershipChange={handleOwnershipChange}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountForm.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <FormControl>
                                                        <CurrencySelect
                                                            selectedCurrency={selectedCurrency}
                                                            setSelectedCurrency={setSelectedCurrency}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <FormLabel>Automatically create a credit card?</FormLabel>
                                    <RadioGroup
                                        value={creditCard}
                                        onValueChange={(value) => setCreditCard(value)}
                                        className="flex items-center gap-4 mt-2"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="yes" />
                                            <span>Yes</span>
                                        </Label>
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="no" />
                                            <span>No</span>
                                        </Label>
                                    </RadioGroup>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="negative" onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button variant={ownership === "Personal" ? "gradient" : "default" as "gradient" | "default"} onClick={handleFinishOrContinue}>
                                        {ownership === "Personal" ? "Finish" : "Continue"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}


            {step === 3 && (
                <Card className="mt-6">
                    <CardContent>
                        <h2 className="text-2xl font-semibold text-center mt-4 mb-8">Business Information</h2>
                        <Form {...businessForm}>
                            <form
                                onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={businessForm.control}
                                    name="businessName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="BankToo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={businessForm.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registration Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123456789" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={businessForm.control}
                                        name="pib"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PIB</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123456789" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={businessForm.control}
                                    name="activityCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activity Code</FormLabel>
                                            <FormControl>
                                                <ActivityCodeDropdown
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={businessForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 main St, City, Country" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={businessForm.control}
                                    name="majorityOwner"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Majority Owner</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jon Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4 mt-4">
                                    <Button variant="ghost" onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button type="submit" variant="gradient">
                                        Finish
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}