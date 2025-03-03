import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import ExistingAccountDialog from "@/components/createBankAccount/ExistingAccountDialog.tsx";

export default function CreateAccountDialog() {
    const [selectedOption, setSelectedOption] = useState("new");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
                setIsDialogOpen(true);
            } else {
                setIsEmailValid(false);
            }
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="gradient" className="absolute bottom-55 right-8">Create Account</Button>
                </DialogTrigger>

                <DialogContent className="max-w-md bg-[#0F0F17] text-white p-6 rounded-lg shadow-lg">

                    <div className="flex flex-col items-center text-center">
                        <span className="icon-[ph--user-circle-plus-fill] text-8xl mb-5"/>

                        <DialogTitle className="text-xl font-semibold font-heading">
                            Register client account?
                        </DialogTitle>

                        <DialogDescription className="text-gray-400 mt-2 text-sm font-paragraph">
                            Does your client already have an account? Do you wish to register a new client account or use an existing one?
                        </DialogDescription>
                    </div>

                        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="mt-4 space-y-2 flex flex-row space-x-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new" id="new"/>
                                <Label htmlFor="new">Register a new client account</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="existing" id="existing"/>
                                <Label htmlFor="existing">Use an existing one</Label>
                            </div>
                        </RadioGroup>

                        {selectedOption === "existing" && (
                            <div className="mt-4">
                                <Label htmlFor="email" className="text-gray-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsEmailValid(true);
                                    }}
                                    className={`mt-1 bg-[#1C1C28] text-white border ${isEmailValid ? 'border-gray-600' : 'border-red-500'}`}
                                />
                                {!isEmailValid && <p className="text-red-500 text-xs mt-1">Invalid email format</p>}
                            </div>
                        )}

                        <Button variant="gradient_outline" className="w-full mt-6" onClick={handleContinueClick}>
                            Continue
                        </Button>

                </DialogContent>
            </Dialog>

            {isDialogOpen && <ExistingAccountDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />}
        </>
    );
}
