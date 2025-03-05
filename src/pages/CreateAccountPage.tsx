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

const businessInfoSchema = z.object({
    businessName: z.string()
        .min(1, "Business name is required")
        .max(32, "Business name must be at most 32 characters")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
    registrationNumber: z.string()
        .length(9, "Registration number must be exactly 9 digits long")
        .regex(/^\d{9}$/, "Unique identification number must contain only numbers"),
    pib: z.string()
        .length(9, "PIB must be exactly 9 digits long")
        .regex(/^\d{9}$/, "PIB must contain only numbers"),
    activityCode: z.string().min(1, { message: "Activity Code is required" }),
    address: z .string()
        .min(5, "Address is required")
        .regex(/^[0-9A-Za-zčČćĆžŽšŠđĐ /]+$/, "Only letters, numbers, spaces and / are allowed"),
    majorityOwner: z.string()
        .min(1, "Majority owner name is required")
        .max(32, "Majority owner name must be at most 32 characters")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
});
const emailSchema = z.string().email({ message: "Invalid email format" });
type BusinessInfo = z.infer<typeof businessInfoSchema>;

export default function CreateAccountPage() {
    const location = useLocation();
    const { step2 } = location.state || {};

    const [selectedOption, setSelectedOption] = useState("new");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [step, setStep] = useState(1);
    const [ownership, setOwnership] = useState("Personal");
    const [creditCard, setCreditCard] = useState("yes");
    const [type, setType] = useState("Current Account");
    const [businessName, setBusinessName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [pib, setPib] = useState("");
    const [activityCode, setActivityCode] = useState("");
    const [address, setAddress] = useState("");
    const [majorityOwner, setMajorityOwner] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("EUR");
    const [plan, setPlan] = useState(ownership === "Business" ? "DOO" : "Standard");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfo, string>>>({});
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

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
    }

    useEffect(() => {
        if (location.state?.step2) {
            setStep(location.state.step2);
        }
    }, [location.state]);

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

    const handleFinishOrContinue = () => {
        if (type === "Current Account" && ownership === "Personal") {
            console.log("Sending request to create a personal current account...");
        } else if (type === "Foreign Exchange Account" && ownership === "Personal") {
            console.log("Sending request to create a personal exchange account...");
        } else if (type === "Current Account" && ownership === "Business" || type === "Foreign Exchange Account" && ownership === "Business") {
            if (step === 3) {
                try {
                    businessInfoSchema.parse({businessName, registrationNumber, pib, activityCode, address, majorityOwner,
                    });
                    setErrors({});
                    console.log("Business Information:", {businessName, registrationNumber,pib, activityCode, address, majorityOwner,
                    });
                    if(type === "Current Account"){
                        console.log("Sending request to create a business current account...");
                    } else{
                        console.log("Sending request to create a business exchange account...");
                    }
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const newErrors: Partial<Record<keyof BusinessInfo, string>> = {};
                        error.errors.forEach((e) => {
                            if (e.path[0] in newErrors) return;
                            newErrors[e.path[0] as keyof BusinessInfo] = e.message;
                        });
                        setErrors(newErrors);
                    }
                    console.log("Form is invalid. Please check the errors.");
                }
            } else {
                setStep(step + 1);
            }
        }
    };

    const handlePlanChange = (value) => {
        setPlan(value);
    };
    const handleOwnershipChange = (value) => {
        setOwnership(value);
        setPlan(value === "Business" ? "DOO" : "Standard");
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 rounded-xl shadow-lg border text-[var(--card-foreground)] bg-[var(--card)] border-[var(--border)] flex flex-col ">
            {step === 1 &&
                <>
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="icon-[ph--user-circle-plus-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl mb-5"/>
                        <h2 className="text-xl font-semibold font-heading">Register client account?</h2>
                    </div>
                    <p className="text-[var(--muted-foreground)] mt-2 text-sm text-left font-paragraph">
                        Does your client already have an account? Do you wish to register a new client account or use an
                        existing one?
                    </p>
                    <RadioGroupSelector selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                    {selectedOption === "existing" && (
                        <div className="mt-4 w-full">
                            <Label htmlFor="email" className="text-[var(--muted-foreground)] text-left">Email</Label>
                            <Input id="email"
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError(null);
                                }}
                                className={`mt-1 ${emailError ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} rounded-lg p-2`}
                            />
                            {emailError && <p className="text-[var(--destructive)] text-xs mt-1 text-left">{emailError}</p>}

                        </div>
                    )}
                    <Button variant="gradient_outline" className="w-full mt-6" onClick={handleContinueClick}>
                        Continue
                    </Button>
                </>
            }
            {step == 2 && (
                <div className="w-full max-w-2xl mx-auto space-y-4">
                    <div className="flex flex-col space-y-1 w-full">
                        <TypeSelect type={type} setType={setType} />
                    </div>
                    {type === "Current Account" ? (
                        <div className="flex justify-center items-center space-x-4 w-full">
                            <div className="flex flex-col space-y-1 w-1/2 mt-1.5">
                                <OwnershipSelect ownership={ownership} handleOwnershipChange={handleOwnershipChange} />
                            </div>
                            <div className="flex flex-col space-y-1 w-1/2">
                                <PlanSelect plan={plan} handlePlanChange={handlePlanChange} ownership={ownership}/>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col space-y-1 w-full">
                                    <OwnershipSelect ownership={ownership} handleOwnershipChange={
                                        handleOwnershipChange} />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency}/>
                            </div>
                        </div>
                    )}
                    <div className="text-white text-left font-medium">Automatically create a credit card?</div>
                    <div className="flex space-x-4">
                        <RadioGroup value={creditCard} onValueChange={(value) => setCreditCard(value)} className="flex items-center space-x-4">
                            <Label className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" className="text-white"/>
                                <span className="text-white">Yes</span>
                            </Label>
                            <Label className="flex items-center space-x-2">
                                <RadioGroupItem value="no" className="text-white"/>
                                <span className="text-white">No</span>
                            </Label>
                        </RadioGroup>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <Button variant="ghost" onClick={handleBack}>
                            Back
                        </Button>
                        <Button variant={ownership === "Personal" ? "gradient" : "default" as "gradient" | "default"} onClick={handleFinishOrContinue}>
                            {ownership === "Personal" ? "Finish" : "Continue"}
                        </Button>
                    </div>
                </div>
            )}
            {step == 3 && (
                <div className="w-full max-w-2xl mx-auto space-y-4">
                    <h2 className="text-xl font-semibold text-white text-center font-heading">Business Information</h2>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label className="text-white text-left">Name</Label>
                        <Input className={`bg-[var(--card)] ${errors.businessName ? 'border-destructive' : ''}`} placeholder="BankToo" value={businessName} onChange={(e) => setBusinessName(e.target.value)}/>
                        {errors.businessName && <p className="text-destructive text-sm">{errors.businessName}</p>}
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <Label className="text-white text-left">Registration Number</Label>
                            <Input className={`bg-[var(--card)] ${errors.registrationNumber ? 'border-destructive' : ''}`} placeholder="123456789" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)}/>
                            {errors.registrationNumber &&
                                <p className="text-destructive text-sm">{errors.registrationNumber}</p>}
                        </div>
                        <div className="flex flex-col space-y-2 w-full">
                            <Label className="text-white text-left">PIB</Label>
                            <Input className={`bg-[var(--card)] ${errors.pib ? 'border-destructive' : ''}`} placeholder="123456789" value={pib} onChange={(e) => setPib(e.target.value)}/>
                            {errors.pib && <p className="text-destructive text-sm">{errors.pib}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label className="text-white text-left">Activity Code</Label>
                        <ActivityCodeDropdown className={errors.activityCode ? 'border-destructive' : ''} value={activityCode} onChange={setActivityCode}/>
                        {errors.activityCode && <p className="text-destructive text-sm">{errors.activityCode}</p>}
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label className="text-white text-left">Address</Label>
                        <Input className={`bg-[var(--card)] ${errors.address ? 'border-destructive' : ''}`} placeholder="123 main St, City, Country" value={address} onChange={(e) => setAddress(e.target.value)}/>
                        {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label className="text-white text-left">Majority Owner</Label>
                        <Input className={`bg-[var(--card)] ${errors.majorityOwner ? 'border-destructive' : ''}`} placeholder="Jon Doe" value={majorityOwner} onChange={(e) => setMajorityOwner(e.target.value)}/>
                        {errors.majorityOwner && <p className="text-destructive text-sm">{errors.majorityOwner}</p>}
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <Button variant="ghost" onClick={handleBack}>
                            Back
                        </Button>
                        <Button variant="gradient" onClick={handleFinishOrContinue}>
                            Finish
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}