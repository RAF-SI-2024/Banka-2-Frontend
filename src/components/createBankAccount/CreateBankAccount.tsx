import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useLocation } from "react-router-dom";
import ActivityCodeDropdown from "@/components/createBankAccount/ActivityCodeDropdown.tsx";
import RadioGroupSelector from "@/components/createBankAccount/RadioGroupSelector.tsx";
import PlanSelect from "@/components/createBankAccount/PlanSelect.tsx";
import CurrencySelect from "@/components/createBankAccount/CurrencySelect.tsx";
import TypeSelect from "@/components/createBankAccount/TypeSelect.tsx";
import OwnershipSelect from "@/components/createBankAccount/OwnershipSelect.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription } from "@/components/ui/card.tsx";
import { Currency } from "@/types/currency";
import { getAllCurrencies } from "@/api/currency.ts";
import { getAllUsers } from "@/api/user.ts";
import {Select,SelectItem,SelectValue,SelectContent,SelectTrigger} from "@/components/ui/select.tsx"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form.tsx";
import {CardType} from "@/types/cardType.ts";
import {getAllCardTypes} from "@/api/account.ts";
import {createAccount} from "@/api/account.ts";
import {fetchAccountTypes} from "@/api/account.ts";
import {createCompany} from "@/api/account.ts";
import {createCard} from "@/api/account.ts";
import {CreateBankAccountRequest} from "@/types/bankAccount.ts";
import { BankAccountType } from "@/types/bankAccountType";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";

const businessInfoSchema = z.object({
    businessName: z.string()
        .min(1, "Business name is required")
        .max(32, "Business name must be at most 32 characters")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
    registrationNumber: z.string()
        .length(8, "Must be exactly 8 digits long")
        .regex(/^\d{8}$/, "Unique identification number must contain only numbers"),
    pib: z.string()
        .length(9, "Must be exactly 9 digits long")
        .regex(/^\d{9}$/, "PIB must contain only numbers"),
    activityCode: z.string()
        .min(4, { message: "Activity Code has to be at least 4 digits long"})
        .max(5,{message:"Activity Code can't be more than 5 digits long"}),
    address: z.string()
        .min(5, "Address is required")
        .regex(/^[0-9A-Za-zčČćĆžŽšŠđĐ /]+$/, "Only letters, numbers, spaces and / are allowed"),
    // majorityOwner: z.string()
    //     .min(1, "Majority owner name is required")
    //     .max(55, "Majority owner name must be at most 32 characters")

});

const emailSchema = z.object({ email: z.string().email({ message: "Invalid email format" }) });
type EmailInfo = z.infer<typeof emailSchema>;
type BusinessInfo = z.infer<typeof businessInfoSchema>;

interface CreateBankAccountProps {
    onRegister: () => void;
    registeredEmail?: string;
    onClose: () => void;
}


export default function CreateBankAccount({onRegister, registeredEmail, onClose}: CreateBankAccountProps) {
    const location = useLocation();

    const [selectedOption, setSelectedOption] = useState("new");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [ownership, setOwnership] = useState("Personal");
    const [creditCard, setCreditCard] = useState("yes");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [plan, setPlan] = useState(ownership === "Business" ? "DOO" : "Standard");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [cardTypes, setCardTypes] = useState<CardType[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [currencyId, setCurrencyId] = useState<string | null>(null);
    const [accountTypes, setAccountTypes] = useState<BankAccountType[]>([]);
    const [selectedType, setSelectedType] = useState("Current Account");
    const [selectedPlanId, setSelectedPlanId] = useState<string>("")
    const [selectedCardId, setSelectedCardId] = useState<string | null>(cardTypes.length > 0 ? cardTypes[0].id : null);
    const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
    const [clientID, setClientId] = useState("");


    useEffect(() => {
        const effectFunc = async() => {
            if (registeredEmail) {
                setSelectedOption("existing");
                setEmail(registeredEmail);
                await fetchUserByEmail(registeredEmail);
                setStep(2);
                setEmailError(null);
            }

            console.log("AAAAAAAAA");
            console.log(registeredEmail);
            console.log(step);
        }
        effectFunc();

    }, [registeredEmail]);

    useEffect(() => {
        if (location.state?.step2) {
            setStep(location.state.step2);
        }
    }, [location.state]);

    useEffect(() => {
        if (ownership === "Business") {
            setPlan("DOO");
        } else {
            setPlan("Standard");
        }
    }, [ownership]);


    useEffect(() => {
        const fetchData = async () => {

                // Dohvatanje valuta
                const cachedCurrencies = localStorage.getItem("currencies");
                if (cachedCurrencies) {
                    setCurrencies(JSON.parse(cachedCurrencies));
                } else {
                    try {
                        const response = await getAllCurrencies();
                        console.log("Response:", response);
                        setCurrencies(response);
                        localStorage.setItem("currencies", JSON.stringify(response));
                        console.log("Currencies:", response);
                    } catch (error) {
                        console.error("❌ Error fetching currencies:", error);
                    }
                }


                const cachedCardTypes = localStorage.getItem("cardTypes");
                if (cachedCardTypes) {
                    setCardTypes(JSON.parse(cachedCardTypes));
                } else {
                    try {
                        const response = await getAllCardTypes();
                        setCardTypes(response.items);
                        localStorage.setItem("cardTypes", JSON.stringify(response.items));
                    

                        console.log("Card Types:", response);
                    } catch (error) {
                        console.error("❌ Error fetching card types:", error);
                    }
                }

        };

        fetchData();
    }, [] );

    useEffect(() => {
        if (cardTypes.length > 0 && !selectedCardId) {
            setSelectedCardId(cardTypes[0].id);
            setSelectedCardName(cardTypes[0].name);
        }
    }, [cardTypes, selectedCardId]);


    useEffect(() => {
        const loadAccountTypes = async () => {
            try {

                const response = await fetchAccountTypes();

                setAccountTypes(response || []);
            } catch (err) {
                console.error("Neuspelo učitavanje tipova računa.", err);
            }
        };

        loadAccountTypes();
    }, []);



    const fetchUserByEmail = async (email: string) => {
            try {
                // Make API request to check if the user exists
                const response = await getAllUsers(1, 10, {email});
                if (response.items.length > 0) {
                    setClientId(response.items[0].id);
                    setEmailError(null);
                    setStep(step + 1);
                } else {
                    emailForm.setError("email", {
                        type: "manual",
                        message: "User with that email does not exist.",
                    });
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    emailForm.setError("email", {
                        type: "manual",
                        message: error.errors[0].message,
                    });
                } else {
                    emailForm.setError("email", {
                        type: "manual",
                        message: "An unexpected error occurred.",
                    });
                }
            }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

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
            // majorityOwner: "",
        },
    });

    const emailForm = useForm<EmailInfo>({
        resolver: zodResolver(emailSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const accountForm = useForm({
        defaultValues: {
            accountType: selectedType,
            ownership: ownership,
            plan: plan,
            currency: "EUR",
            cardType: ""
        },
    });

    const onBusinessSubmit = async (data: BusinessInfo) => {
        console.log("Business Data:", data);
        try {
            const mappedData = {
                name: data.businessName,
                registrationNumber: data.registrationNumber,
                taxIdentificationNumber: data.pib,
                activityCode: data.activityCode,
                address: data.address,
                majorityOwnerId: clientID,
            };

            

            const createAccData: CreateBankAccountRequest = {
                name: "Štedni račun",
                dailyLimit: 2000,
                monthlyLimit: 50000,
                clientId: clientID,
                balance: 5000.75,
                currencyId: currencyId || "",
                accountTypeId: selectedPlanId,
                status: true
            };

            if(selectedType === "Current Account"){
                const currencies = JSON.parse(localStorage.getItem("currencies") || "[]");
                const rsdCurrency = currencies.find((currency: any) => currency.code === "RSD");

                if (rsdCurrency) {
                    createAccData.currencyId = rsdCurrency.id;
                }
            }

            const accResponse1 = await  createAccount(createAccData);
            localStorage.setItem("accountId", accResponse1.data.id);
            console.log("respone form step 3: " + accResponse1.data);

            const response = await createCompany(mappedData);

            if (creditCard === "yes") {
                const accountId = localStorage.getItem("accountId");
                const cardData = {
                    cardTypeId: selectedCardId,
                    accountId: accountId,
                    name: selectedCardName,
                    limit: 5000,
                    status: true
                };


                const responseCard = await createCard(cardData);
                console.log("Card response:" + responseCard);
            }

            if (response.success) {
                console.log("Company created successfully:", response.data);
                onClose();
                window.location.reload();
            } else {
                console.error("Failed to create company:", response.data);
            }
        } catch (error) {
            showErrorToast({error, defaultMessage: "Error during company creation."})
            console.error("Error during company creation:", error);
        }
    };


    const handleFinishOrContinue = async (data: any) => {
        if (ownership === "Personal") {
            if (selectedType === "Current Account") {
                const currencies = JSON.parse(localStorage.getItem("currencies") || "[]");
                const rsdCurrency = currencies.find((currency: any) => currency.code === "RSD");

                if (rsdCurrency) {
                    data.currencyId = rsdCurrency.id;
                }

                try {
                    const response = await createAccount(data);
                    localStorage.setItem("accountId", response.data.id);


                    if (creditCard === "yes") {
                        const accountId = localStorage.getItem("accountId");
                        const cardData = {
                            cardTypeId: selectedCardId,
                            accountId: accountId,
                            name: selectedCardName,
                            limit: 5000,
                            status: true
                        };


                        const responseCard = await createCard(cardData);
                    }
                    onClose();
                    window.location.reload();
                } catch (error) {
                    showErrorToast({error, defaultMessage: "Error creating account."})
                    console.error("Error creating account:", error);
                }

            } else if (selectedType === "Foreign Currency Account") {
                const selectedCurrency = data.currencyId;

                if (!selectedCurrency) {
                    console.error("No currency selected for Foreign Currency Account.");
                    return;
                }

                try {
                    const selectedPlan = accountTypes.find((account: any) => account.name === "Foreign Currency Account");
                    console.log("Selected Plan:", selectedPlan);
                    if (selectedPlan) {
                        setSelectedPlanId(selectedPlan.id);
                        data.accountTypeId = selectedPlan.id;
                    }

                    const response = await createAccount(data);

                    if (creditCard === "yes") {
                        const accountId = localStorage.getItem("accountId");
                        const cardData = {
                            cardTypeId: selectedCardId,
                            accountId: accountId,
                            name: selectedCardName,
                            limit: 5000,
                            status: true
                        };


                        const responseCard = await createCard(cardData);
                    }
                    onClose();
                    window.location.reload();
                } catch (error) {
                    showErrorToast({error, defaultMessage: "Error creating Foreign Currency Account."})
                    console.error("Error creating Foreign Currency Account:", error);
                }
            }
        } else {

            if (selectedType === "Foreign Currency Account" && step === 3) {
                try {
                    const selectedPlan = accountTypes.find((account: any) => account.name === "Business Foreign Currency Account");
                    if (selectedPlan) {
                        setSelectedPlanId(selectedPlan.id);
                        data.accountTypeId = selectedPlan.id;
                    }

                    const response = await createAccount(data);
                    console.log("Business Foreign Currency Account created successfully:", response);


                    if (creditCard === "yes") {
                        const accountId = localStorage.getItem("accountId");
                        const cardData = {
                            cardTypeId: selectedCardId,
                            accountId: accountId,
                            name: selectedCardName,
                            limit: 5000,
                            status: true
                        };

                       const responseCard = await createCard(cardData);
                    }
                    onClose();
                } catch (error) {
                    showErrorToast({error, defaultMessage: "Error creating Business Foreign Currency Account."})
                    console.error("Error creating Business Foreign Currency Account:", error);
                }
            }

            if (step === 3) {
                try {
                    console.log("📌 Podaci za kreiranje account-a:", data);
                    const accountResponse = await createAccount(data);

                    if (accountResponse.success) {
                        console.log("Business account created successfully:", accountResponse.data);
                        localStorage.setItem("accountId", accountResponse.data.id);

                        await businessForm.handleSubmit(onBusinessSubmit)();
                    } else {
                        throw new Error("Failed to create business account");
                    }
                } catch (error) {
                    showErrorToast({error, defaultMessage: "Error creating business account."})
                    console.error("Error creating business account:", error);
                }
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
        <>
            {step === 1 && (
                <Card className="bg-transparent border-0 items-center">
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
                                        fetchUserByEmail(data.email);
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
                            <Button type="button" variant="default" className="w-full mt-6" onClick={onRegister}>
                                Continue
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card className="bg-transparent border-0 items-center">
                    <CardContent>

                        <Form {...accountForm}>
                            <form onSubmit={accountForm.handleSubmit((data) => {
                                const clientId = clientID;
                                const name = null;
                                const dailyLimit = 2000;
                                const monthlyLimit = 50000;
                                const balance = 5000.75;
                                const accountTypeId = selectedPlanId;
                                const status  = true;

                                const finalData = {
                                    ...data,
                                    clientId,
                                    name,
                                    dailyLimit,
                                    monthlyLimit,
                                    balance,
                                    accountTypeId,
                                    status
                                };


                                const finishData = {
                                    name: finalData.name || "Štedni račun",
                                    dailyLimit: finalData.dailyLimit,
                                    monthlyLimit: finalData.monthlyLimit,
                                    clientId: finalData.clientId,
                                    balance: finalData.balance,
                                    currencyId: finalData.currency,
                                    accountTypeId: finalData.accountTypeId,
                                    status: finalData.status
                                };



                                handleFinishOrContinue(finishData);
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
                                                <TypeSelect type={selectedType} setType={setSelectedType} accountTypes={accountTypes} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {selectedType === "Current Account" ? (
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
                                                            accountTypes={accountTypes}
                                                            setSelectedPlanId={setSelectedPlanId}
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
                                                            onChange={(value) => {
                                                                const selectedCurrencyData = currencies.find(currency => `${currency.code} - ${currency.symbol}` === value);
                                                                if (selectedCurrencyData) {
                                                                    setCurrencyId(selectedCurrencyData.id);
                                                                    field.onChange(selectedCurrencyData.id);
                                                                }
                                                            }}
                                                            value={currencies.find(currency => currency.id === currencyId) ? `${currencies.find(currency => currency.id === currencyId)?.code} - ${currencies.find(currency => currency.id === currencyId)?.symbol}` : ''}
                                                            currencies={currencies}
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
                                {creditCard === "yes" && (
                                    <FormField
                                        control={accountForm.control}
                                        name="cardType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Card Type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const selectedCard = cardTypes.find((card) => card.id === value);
                                                            if (selectedCard) {
                                                                setSelectedCardId(selectedCard.id);
                                                                setSelectedCardName(selectedCard.name);
                                                            }
                                                            field.onChange(value);
                                                        }}
                                                        value={field.value || selectedCardId || (cardTypes.length > 0 ? cardTypes[0].id : '')}
                                                        >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Card Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cardTypes.map((card) => (
                                                                <SelectItem key={card.id} value={card.id}>
                                                                    {card.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="flex gap-4">
                                    <Button variant="negative" onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button variant={ownership === "Personal" ? "gradient" : "default" as "gradient" | "default"}>
                                        {ownership === "Personal" ? "Finish" : "Continue"}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                    </CardContent>
                </Card>
            )}


            {step === 3 && (
                <Card className="bg-transparent border-0 items-center">
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
                                {/* <FormField
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
                                /> */}
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
        </>
    );
}