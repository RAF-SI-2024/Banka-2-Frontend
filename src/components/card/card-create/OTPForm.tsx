import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp.tsx"
import React, {useEffect, useState} from "react";

type ErrorType = {
    id: number;
    title: string;
    description: string
} | null;

interface OTPFormProps {
    form: any;
    nextStep: () => void;
    setErrors: (error: ErrorType) => void;
}

export default function OTPForm({form, nextStep, setErrors}: OTPFormProps){

    const [value, setValue] = useState("")

    useEffect(() => {
        requestOTP();
    }, []);

    const handleChange = (value: string) => {
        setValue(value)
        if(value.length === 6)
            submitOTP(value)
    }

    async function requestOTP() {
        try {
            // TODO Ovde treba da se doda zahtev za dobijanje mejla o otp

        } catch (error) {
            console.error("Failed to reach backend:", error);
            setErrors({
                id: Date.now(),
                title: "Failed to reach backend",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),
            });
        }
    }

    async function submitOTP(value: string) {
        try {
            // TODO Ovde treba dodati zahtev za slanje otp na backend
            console.log(value)
            const response = true;
            form.setValue("otp", value);
            if(response)
                nextStep()

        } catch (error) {
            console.error("Failed to confirm OTP:", error);
            setErrors({
                id: Date.now(),
                title: "Failed to confirm OTP",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),
            });
        }
    }

    return (
        <>
            <p>OTP code has been sent to your email address. </p>
            <p className="text-sm mb-4">Please enter the 6 characters sent to your email.</p>

            <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => handleChange(value)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
        </>
    )
}