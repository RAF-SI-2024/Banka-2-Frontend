import {useContext, useEffect, useState} from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp.tsx";
import {updateAccountLimits} from "@/api/auth.ts";
import {z} from "zod";
import {AuthContext} from "@/context/AuthContext.tsx";

interface BankAccountDetailsAdjustLimitsDialogProps {
    accountName: string;
    accountId: string;
    open: boolean;
    onClose: () => void;
}

export default function BankAccountDetailsAdjustLimitsDialog({accountName, accountId, open, onClose}: BankAccountDetailsAdjustLimitsDialogProps) {
    const [step, setStep] = useState<"otp" | "form">("otp");

    const [dailyLimit, setDailyLimit] = useState<string>("");
    const [monthlyLimit, setMonthlyLimit] = useState<string>("");
    const context = useContext(AuthContext);

    console.log("ID context: ", context?.user?.id);

    useEffect(() => {
        if (!open) {
            setStep("otp");
        }
    }, [open]);

    if(step==="otp"){
        return(
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-xl !max-h-[95vh] bg-card overflow-hidden">
                        <OtpStep
                            email = {context?.user?.email}
                            onComplete={() => setStep("form")} />
                </DialogContent>
            </Dialog>
        );
    }

    if(step==="form"){

        return(
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-xl !max-h-[95vh] bg-card overflow-hidden">
                    <FormStep
                        accountName = {accountName}
                        accountId={accountId}
                        onClose={onClose}
                        dailyLimit={dailyLimit}
                        setDailyLimit={setDailyLimit}
                        monthlyLimit={monthlyLimit}
                        setMonthlyLimit={setMonthlyLimit}
                    />
                </DialogContent>
            </Dialog>
        );
    }
}

const OtpStep = ({

    email,
    onComplete
}: {
    email: string | undefined
    onComplete: () => void }) => {
    const [value, setValue] = useState("");

    function handleChange(newValue: string) {
        if (/^\d*$/.test(newValue)) {
            setValue(newValue);
        }
    }

    function handleComplete() {
        console.log("OTP entered:", value);
        onComplete();
    }

    return (
        <>
            <DialogTitle className="text-center text-4xl font-heading font-semibold">Enter verification code</DialogTitle>
            <div className="p-4 w-full flex flex-col items-center">
                <InputOTP maxLength={6} className="flex justify-center gap-4" value={value} onChange={handleChange} onComplete={handleComplete}>
                    <InputOTPGroup className="flex gap-4 justify-center">
                        <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                        <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                        <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                        <InputOTPSlot index={4} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                        <InputOTPSlot index={5} className="w-14 h-14 text-2xl font-bold text-center border border-gray-400 rounded-lg" />
                    </InputOTPGroup>
                </InputOTP>
                <DialogDescription className="text-center text-lg font-light">
                    An email has been sent to {email}
                </DialogDescription>
                <DialogDescription className="text-center text-lg font-light">
                    Didn't receive the code?
                </DialogDescription>
                <Button variant="link" className="text-blue-500">Resend verification code</Button>
            </div>
        </>
    );
};

const FormStep = ({
    accountName,
    accountId,
    onClose,
    dailyLimit,
    setDailyLimit,
    monthlyLimit,
    setMonthlyLimit,
    }: {
    accountName: string;
    accountId: string;
    onClose: () => void;
    dailyLimit: string;
    setDailyLimit: React.Dispatch<React.SetStateAction<string>>;
    monthlyLimit: string;
    setMonthlyLimit: React.Dispatch<React.SetStateAction<string>>;
}) => {

    const formSchema = z.object({
        dailyLimit: z
            .string()
            .refine((val) => !isNaN(parseFloat(val)), {
                message: "Daily limit must be a valid number",
            }),
        monthlyLimit: z
            .string()
            .refine((val) => !isNaN(parseFloat(val)), {
                message: "Monthly limit must be a valid number",
            })
    });

    async function handleSubmit() {

        try {

            formSchema.parse({
                dailyLimit,
                monthlyLimit,
            });

            const formattedDailyLimit = parseFloat(dailyLimit);
            const formattedMonthlyLimit = parseFloat(monthlyLimit);


            console.log(" AAAA accID: " + accountId + "accName: " + accountName + "daily: " + formattedDailyLimit + "monthly: " + formattedMonthlyLimit)
            const response = await updateAccountLimits(accountId, accountName, formattedDailyLimit, formattedMonthlyLimit);
            console.log("Limits updated successfully!", response);
            onClose();
        } catch (error) {
            console.error("Error updating limits:", error);
        }

    }

    return (
        <>
            <DialogTitle>Edit Limits</DialogTitle>
            <div className="p-4 flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Daily Limit</label>
                    <input
                        type="text"
                        className="border border-gray-400 rounded-lg p-2"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                        placeholder="Enter daily limit"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Monthly Limit</label>
                    <input
                        type="text"
                        className="border border-gray-400 rounded-lg p-2"
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(e.target.value)}
                        placeholder="Enter monthly limit"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Save Limits</Button>
                </div>
            </div>
        </>
    );
};
