import {Button} from "@/components/ui/button";
import Footer from "@/components/common/Footer.tsx";
import { Particles } from "@/components/common/Particles.tsx";
import {BottomBar} from "@/components/common/BottomBar.tsx";
import * as React from "react";
import HeaderWithLogo from "@/components/common/header/HeaderWithLogo.tsx";
import RegisterFormFirst from "@/components/register/RegisterFormFirst.tsx";
import {useState} from "react";
import RegisterFormSecond from "@/components/register/RegisterFormSecond.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";



export default function RegisterPage() {

    const [step, setStep] = useState(1);

    const formSchema = z.object({
        firstName: z
            .string()
            .min(2, "First name is required")
            .max(32, "First name must be at most 32 characters")
            .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
        lastName: z
            .string()
            .min(2, "Last name is required")
            .max(32, "Last name must be at most 32 characters")
            .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Only letters and spaces are allowed"),
        email: z
            .string()
            .email("Invalid email format")
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
        username: z
            .string()
            .regex(/^[@0-9A-Za-zčČćĆžŽšŠđĐ]+$/, "Only letters, numbers, and '@' are allowed"),
        uniqueIdentificationNumber: z
            .string()
            .length(13, "Unique identification number must be exactly 13 characters")
            .regex(/^\d{13}$/, "Unique identification number must contain only numbers"),
        phoneNumber: z
            .string()
            .regex(/^\+\d{0,11}$/, "Phone number must contain up to 11 digits"),
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
        role: z.string().min(1, "Role is required"),
        employed: z.string().min(1, "Employment status is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    async function nextStep() {
        const isValid = await form.trigger();
        if (isValid) {
            setStep((prev) => prev + 1);
        }
    }
    function prevStep() {
        setStep((prev) => prev -1);
    }

    return(
        <>

            {/*Header, main part and login fit the screen*/}
            <div className="max-w-full min-h-dvh justify-between flex flex-initial flex-col m-0 p-0 gap-0 relative">
                {/*z and relative to make Header in front of particles*/}
                <HeaderWithLogo className="z-50 relative">
                    <Button type="button" variant="gradient">
                        Log in
                    </Button>
                </HeaderWithLogo>

                <main>
                    {/*absolute so that they overlap with other parts of the page,
                    z is set as well. mix = blending mode hard light for cooler effect*/}
                    <Particles className="absolute inset-0 pointer-events-none z-10 mix-blend-hard-light" quantity={8}/>

                    {/*put the card and text in the center of the page, gap-2 for spacing between text and card*/}

                    <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                        {/*Log in text - behind the particles*/}
                        <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                            Join BankToo </h1>
                        {/*Log in form/card - in front of the parrticles*/}
                        <div className="w-full max-w-sm z-10 relative">
                            {step === 1 && <RegisterFormFirst form={form} className={""} nextStep={nextStep}/>}
                            {step === 2 && <RegisterFormSecond form={form} className={""} nextStep={nextStep} prevStep={prevStep}/>}

                        </div>
                    </div>


                </main>

                {/*bottom bar - in front of the particles*/}
                <BottomBar className="relative z-50">
                    <p className="text-p">
                        Have an account already?{" "}
                        <Button variant="link" size="tight" className="text-base">
                            Log in
                        </Button>
                    </p>
                </BottomBar>
            </div>

            {/*footer - in front of the particles*/}

            <Footer className="z-10 relative"/>

        </>
    )
}