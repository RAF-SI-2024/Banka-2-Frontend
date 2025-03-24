import * as React from "react";
import Stepper from "@/components/__common__/Stepper.tsx";
import EmailConfirmation from "@/components/__common__/EmailConfirmation.tsx";
import {RegisterRequestClient, RegisterRequestEmployee} from "@/types/auth.ts";
import {registerClient, registerEmployee} from "@/api/auth.ts";
import { Button } from "@/components/ui/button";
import {CardFooter} from "@/components/ui/card.tsx";
import {Role} from "@/types/user.ts";

interface ActivationConfirmationProps extends React.ComponentProps<"div"> {
    onContinue?: () => void;
    continueVariant?: Role;
    registerdata?: RegisterRequestEmployee | RegisterRequestClient,
    className: string,
}

export default function ActivationConfirmation({ onContinue, continueVariant=Role.Employee, registerdata, className, ...props}: ActivationConfirmationProps) {
    // Type guard function
    function isEmployee(data: RegisterRequestEmployee | RegisterRequestClient): data is RegisterRequestEmployee {
        return (data as RegisterRequestEmployee).department !== undefined;
    }

    async function handleUrlClick() {
        try {
            if(!registerdata)
                throw new Error("No register data found.");

            let response;

            if (isEmployee(registerdata)) {
                response = await registerEmployee(registerdata);
            } else {
                response = await registerClient(registerdata);
            }

            if (response.status === 200) {
                console.log("Resend successfull");
            }
        }
        catch(error){
            console.error("Resend failed:", error);
        }

    }

    return (
        <div>
            <EmailConfirmation title="Activation email has been sent!"
                               description="We've sent an activation link to the email you provided. Please check the
                            inbox (and spam folder) and click the link to activate the
                            account."
                               resendQuestion="Didn't receive the email?"
                               resendUrlText="Resend activation email" {...props}
                                beforeTitleContent={
                                    <Stepper totalSteps={4} currentStep={3}/>
                                }
                               onUrlClick={handleUrlClick}
                               className={className}
                                {...props}
                                footer={
                                    <CardFooter className="flex flex-row gap-4 justify-center">
                                        {
                                            continueVariant === Role.Employee &&
                                            <Button variant="default" onClick={onContinue}>Continue bank account creation</Button>
                                        }
                                        {
                                            continueVariant === Role.Admin &&
                                                <Button variant="gradient" onClick={onContinue}>Finish</Button>
                                        }


                                    </CardFooter>
                                 }>
            </EmailConfirmation>

        </div>

    )
}
