import * as React from "react"
import RegisterFormFirst from "@/components/register/RegisterFormFirst.tsx"
import { useState } from "react"
import RegisterFormSecond from "@/components/register/RegisterFormSecond.tsx"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export default function RegisterPage() {
  const [step, setStep] = useState(1)

    const formSchema = z.object({
        firstName: z
            .string()
            .min(1, "First name is required")
            .max(32, "First name must be at most 32 characters")
            .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .max(32, "Last name must be at most 32 characters")
            .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
        email: z
            .string()
            .email("Invalid email format"),
        username: z
            .string()
            .regex(/^[@0-9A-Za-zčČćĆžŽšŠđĐ]+$/, "Only letters, numbers, and '@' are allowed"),
        uniqueIdentificationNumber: z
            .string()
            .length(13, "Unique identification number must be exactly 13 characters")
            .regex(/^\d{13}$/, "Unique identification number must contain only numbers"),
        phoneNumber: z
            .string()
            .min(12, "Phone number does not have enough digits")
            .max(13, "Phone number has more than 13 digits")
            .regex(/^\+\d{11,12}$/, "Phone number must start with + followed by 11-12 digits"),
        address: z
            .string()
            .min(5, "Address is required")
            .regex(/^[0-9A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters, numbers, and spaces are allowed"),
        department: z
            .string()
            .regex(/^[0-9A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters, numbers, and spaces are allowed"),
        dateOfBirth: z.date({
            required_error: "Date of birth is required",
            invalid_type_error: "Invalid date format",
        }),
        gender: z.string().min(1, "Gender is required"),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: new Date(),
            uniqueIdentificationNumber: "",
            gender: "",
            email: "",
            username: "",
            phoneNumber: "",
            address: "",
            department: "",
        }
    });

    async function nextStepFirst() {
        const isValid = await form.trigger([
            "firstName",
            "lastName",
            "dateOfBirth",
            "uniqueIdentificationNumber",
            "gender",
        ]);

        if (isValid) {
            setStep((prev) => prev + 1);
        }
    }

    function prevStep() {
        setStep((prev) => prev - 1);
    }

    return(
        <>

            <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                    Join BankToo </h1>
                {/*Register form/card - in front of the parrticles*/}
                <div className="w-full max-w-sm z-10 relative">
                    {step === 1 && <RegisterFormFirst form={form} className={""} nextStep={nextStepFirst}/>}
                    {step === 2 && <RegisterFormSecond form={form} className={""} prevStep={prevStep} setStep={setStep}/>}
                </div>
            </div>
        </>
        )
}
