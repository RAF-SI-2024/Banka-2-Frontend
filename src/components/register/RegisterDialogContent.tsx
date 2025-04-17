import * as React from "react"
import RegisterFormFirst from "@/components/register/RegisterFormFirst.tsx"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import ActivationConfirmation from "@/components/register/ActivationConfirmation.tsx"
import RegisterFormSecondClient from "@/components/register/client/RegisterFormSecondClient.tsx"
import { RegisterRequestClient } from "@/types/bank_user/auth.ts"
import {Role} from "@/types/bank_user/user.ts";
import RegisterFormSecondEmployee from "@/components/register/employee/RegisterFormSecondEmployee.tsx";

interface RegisterPageProps {
  variant: Role;
  onClose: (email?: string) => void;
}

export default function RegisterDialogContent({variant, onClose}: RegisterPageProps) {

  // your existing code...

  function onContinue() {
      onClose(registerdata?.email);
  }


  const [step, setStep] = useState(1)
  const [registerdata, setRegisterdata] = useState<
    RegisterRequestClient | undefined
  >(undefined)

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
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .regex(
        /^[@0-9A-Za-zčČćĆžŽšŠđĐ]+$/,
        "Only letters, numbers, and '@' are allowed"
      ),
    uniqueIdentificationNumber: z
      .string()
      .length(13, "Unique identification number must be exactly 13 digits long")
      .regex(
        /^\d{13}$/,
        "Unique identification number must contain only numbers"
      ),
    phoneNumber: z
      .string()
      .min(12, "Phone number does not have enough digits")
      .max(13, "Phone number has more than 13 digits")
      .regex(
        /^\+\d{11,12}$/,
        "Phone number must start with + followed by 11-12 digits"
      ),
    address: z
      .string()
      .min(5, "Address is required")
      .regex(
        /^[0-9A-Za-zčČćĆžŽšŠđĐ /]+$/,
        "Only letters, numbers, spaces and / are allowed"
      ),
    department: z
      .string()
      .regex(
        /^[0-9A-Za-zčČćĆžŽšŠđĐ ]+$/,
        "Only letters, numbers, and spaces are allowed"
      ),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    }),
    gender: z.string().min(1, "Gender is required"),
  })

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
    },
  })

  async function nextStepFirst() {
    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "dateOfBirth",
      "uniqueIdentificationNumber",
      "gender",
    ])

    if (isValid) {
      setStep((prev) => prev + 1)
    }
  }

  async function nextStepSecond(registerdata: RegisterRequestClient) {
    if (!registerdata) {
      return
    }
    setRegisterdata(registerdata)
    setStep((prev) => prev + 1)
  }

  function prevStep() {
    setStep((prev) => prev - 1)
  }

  return (
      <div className="flex flex-col justify-center items-center self-center w-full gap-2">
        {step === 1 && (
          <RegisterFormFirst
            form={form}
            className={""}
            nextStep={nextStepFirst}
          />
        )}
        {step === 2 && (
            variant===Role.Employee?
            <RegisterFormSecondClient
              form={form}
              className={""}
              prevStep={prevStep}
              nextStep={nextStepSecond}
            />:
                <RegisterFormSecondEmployee
                    form={form}
                    className={""}
                    prevStep={prevStep}
                    nextStep={nextStepSecond}
                />

        )}
        {step === 3 && (
          <ActivationConfirmation
            registerdata={registerdata}
            continueVariant={variant}
            onContinue={onContinue}
            className="max-w-xl"
          />
        )}
      </div>
  )
}
