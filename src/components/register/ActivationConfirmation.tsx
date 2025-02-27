import * as React from "react";
import Stepper from "@/components/common/Stepper.tsx";
import EmailConfirmation from "@/components/common/EmailConfirmation.tsx";


export default function ActivationConfirmation({ className, ...props}: React.ComponentProps<"div">) {

    return (
            <EmailConfirmation title="Activation email has been sent!"
                               description="We've sent an activation link to your email. Please check your
                            inbox (and spam folder) and click the link to activate your
                            account."
                               resendQuestion="Didn't receive the email?"
                               resendUrlText="Resend activation email" {...props}
                                beforeTitleContent={
                                    <Stepper totalSteps={4} currentStep={3}/>
                                }
                               className={className}>
            </EmailConfirmation>

    )
}
