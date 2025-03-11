import {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp.tsx";

interface BankAccountDetailsAdjustLimitsDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function BankAccountDetailsAdjustLimitsDialog({ open, onClose }: BankAccountDetailsAdjustLimitsDialogProps) {
    const [step, setStep] = useState<"otp" | "form">("otp");

    useEffect(() => {
        if (!open) {
            setStep("otp");
        }
    }, [open]);

    if(step==="otp"){
        return(
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-xl !max-h-[95vh] bg-card overflow-hidden">
                        <OtpStep onComplete={() => setStep("form")} />
                </DialogContent>
            </Dialog>
        );
    }

    if(step==="form"){
        return(
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-xl !max-h-[95vh] bg-card overflow-hidden">
                    <FormStep onClose={onClose} />
                </DialogContent>
            </Dialog>
        );
    }
}

const OtpStep = ({ onComplete }: { onComplete: () => void }) => {
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
            <DialogTitle className="text-center text-4xl font-semibold">Enter verification code</DialogTitle>
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
                    An email has been sent to example@example.com
                </DialogDescription>
                <DialogDescription className="text-center text-lg font-light">
                    Didn't receive the code?
                </DialogDescription>
                <Button variant="link" className="text-blue-500">Resend verification code</Button>
            </div>
        </>
    );
};

const FormStep = ({ onClose }: { onClose: () => void }) => {
    return (
        <>
            <DialogTitle>Nestoo</DialogTitle>
        </>
    );
};
