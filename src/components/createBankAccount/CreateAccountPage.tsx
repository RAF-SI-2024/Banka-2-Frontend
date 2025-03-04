import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function CreateAccountPage() {
    const [selectedOption, setSelectedOption] = useState("new");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [step, setStep] = useState(1);
    const [ownership, setOwnership] = useState("Personal");
    const [creditCard, setCreditCard] = useState("yes");
    const [type, setType] = useState("Current Account")

    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleContinueClick = () => {
        if (selectedOption === "new") {
            navigate("/register");
        } else if (selectedOption === "existing") {
            if (validateEmail(email)) {
                setStep(step + 1);
            } else {
                setIsEmailValid(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleFinishOrContinue = () => {

        if (type === "Current Account" && ownership === "Personal") {
            // TODO: Pošalji zahtev na server za kreiranje obicnog naloga
            console.log("Sending request to create a personal current account...");
        }
        else if (type === "Foreign Exchange Account" && ownership === "Personal") {
            // TODO: Pošalji zahtev na server za kreiranje obicnog naloga
            console.log("Sending request to create a personal exchange account...");
        }
        else if (type === "Current Account" && ownership === "Business") {

            if(step === 3){
                // TODO: Pošalji zahtev na server za kreiranje biznis naloga
                console.log("Sending request to create a bussiness current account...");
            }
            else {
                setStep(step + 1);
            }
        }
        else if (type === "Foreign Exchange Account" && ownership === "Business") {

            if(step === 3){
                // TODO: Pošalji zahtev na server za kreiranje biznis naloga
                console.log("Sending request to create a bussiness exchange account...");
            }
            else {
                setStep(step + 1);
            }
        }
    };


    return (
        <div className="max-w-lg mx-auto mt-10 p-8 rounded-xl shadow-lg border text-[var(--card-foreground)] bg-[var(--card)] border-[var(--border)] flex flex-col items-center text-center">
            {step === 1 &&
                <>
                    <span className="icon-[ph--user-circle-plus-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl mb-5" />
                    <h2 className="text-xl font-semibold font-heading">Register client account?</h2>
                    <p className="text-[var(--muted-foreground)] mt-2 text-sm text-left">
                        Does your client already have an account? Do you wish to register a new client account or use an existing one?
                    </p>

                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="mt-4 flex flex-row space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="new"
                                id="new"
                                className="border-white checked:bg-white"
                            />
                            <Label htmlFor="new">Register a new client account</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="existing"
                                id="existing"
                                className="border-white checked:bg-white"
                            />
                            <Label htmlFor="existing">Use an existing one</Label>
                        </div>
                    </RadioGroup>


                    {selectedOption === "existing" && (
                        <div className="mt-4 w-full">
                            <Label htmlFor="email" className="text-[var(--muted-foreground)]">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsEmailValid(true);
                                }}
                                className={`mt-1 bg-[var(--muted)] text-[var(--foreground)] border ${isEmailValid ? 'border-[var(--border)]' : 'border-[var(--destructive)]'} rounded-lg p-2`}
                            />
                            {!isEmailValid && <p className="text-[var(--destructive)] text-xs mt-1">Invalid email format</p>}
                        </div>
                    )}

                    <Button variant="gradient_outline" className="w-full mt-6" onClick={handleContinueClick}>
                        Continue
                    </Button>
                </>
            }
            {step == 2 && (
                <div className="w-full max-w-2xl mx-auto space-y-4">
                    {/* Type dropdown */}
                    <div className="flex flex-col space-y-1 w-full">
                        <Label className="text-white text-left">Type</Label>
                        <select
                            className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Current Account">Current Account</option>
                            <option value="Foreign Exchange Account">Foreign Exchange Account</option>
                        </select>
                    </div>

                    {/* Conditional rendering based on type */}
                    {type === "Current Account" ? (
                        // Ownership & Plan in the same row for "Current Account"
                        <div className="flex space-x-4 w-full">
                            <div className="flex flex-col space-y-1 w-1/2">
                                <Label className="text-white text-left">Ownership</Label>
                                <select
                                    className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg"
                                    value={ownership}
                                    onChange={(e) => setOwnership(e.target.value)}
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1 w-1/2">
                                <Label className="text-white text-left">Plan</Label>
                                <select className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                                    {ownership === "Business" ? (
                                        <>
                                            <option value="DOO">DOO</option>
                                            <option value="AD">AD</option>
                                            <option value="Fondacija">Fondacija</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Standard">Standard</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Pensioners">Pensioners</option>
                                            <option value="Youth">Youth</option>
                                            <option value="Student">Student</option>
                                            <option value="Unemployed">Unemployed</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    ) : (
                        // Ownership & Currency in separate rows for "Foreign Exchange Account"
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1 w-full">
                                <Label className="text-white text-left">Ownership</Label>
                                <select
                                    className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg"
                                    value={ownership}
                                    onChange={(e) => setOwnership(e.target.value)}
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <Label className="text-white text-left">Currency</Label>
                                <select className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                                    <option value="EUR">EUR</option>
                                    <option value="CHF">CHF</option>
                                    <option value="USD">USD</option>
                                    <option value="GBP">GBP</option>
                                    <option value="JPY">JPY</option>
                                    <option value="CAD">CAD</option>
                                    <option value="AUD">AUD</option>

                                </select>
                            </div>
                        </div>
                    )}

                    <div className="text-white text-left font-medium">Automatically create a credit card?</div>

                    {/* Radio buttons */}
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="credit-card"
                                value="yes"
                                checked={creditCard === "yes"}
                                onChange={(e) => setCreditCard(e.target.value)}
                                className="form-radio text-white"
                            />
                            <span className="text-white">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="credit-card"
                                value="no"
                                checked={creditCard === "no"}
                                onChange={(e) => setCreditCard(e.target.value)}
                                className="form-radio text-white"
                            />
                            <span className="text-white">No</span>
                        </label>
                    </div>

                    <div className="flex space-x-4 mt-4">
                        <button
                            className="px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: "hsl(231, 17%, 16%)" }}
                            onClick={handleBack}
                        >
                            Back
                        </button>

                        <button
                            className={`px-4 py-2 rounded-lg ${
                                ownership === "Personal" ? "bg-blue-500 text-white" : "bg-white text-black"
                            }`}
                            onClick={handleFinishOrContinue}
                        >
                            {ownership === "Personal" ? "Finish" : "Continue"}
                        </button>
                    </div>
                </div>
            )}

            {step == 3 && (
                <div className="w-full max-w-2xl mx-auto space-y-4">

                    <h2 className="text-xl font-semibold text-white text-center">Business Information</h2>

                    <div className="flex flex-col space-y-1 w-full">
                        <Label className="text-white text-left">Name</Label>
                        <Input className="bg-[var(--card)]" placeholder="BankToo" />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex flex-col space-y-1 w-full">
                            <Label className="text-white text-left">Registration Number</Label>
                            <Input className="bg-[var(--card)]" placeholder="123456789" />
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
                            <Label className="text-white text-left">PIB</Label>
                            <Input className="bg-[var(--card)]" placeholder="123456789" />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1 w-full">

                        <Label className="text-white text-left">Activity Code</Label>
                        <select className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                            <option>MOŽE I DA SE KUCA | DROPDOWN</option>
                        </select>
                    </div>


                    <div className="flex flex-col space-y-1 w-full">
                        <Label className="text-white text-left">Address</Label>
                        <Input className="bg-[var(--card)]" placeholder="123 main St, City, Country"/>
                    </div>

                    <div className="flex flex-col space-y-1 w-full">

                        <Label className="text-white text-left">Majority Owner</Label>
                        <Input className="bg-[var(--card)]" placeholder="Jon Doe"/>
                    </div>

                    <div className="flex space-x-4 mt-4">
                        <button
                            className="px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: "hsl(231, 17%, 16%)" }}
                            onClick={handleBack}
                        >
                            Back
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white"

                            onClick={handleFinishOrContinue}
                        >
                            Finish
                        </button>
                    </div>
                </div>
                )
            }
        </div>
    );
}
