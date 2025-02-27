import {Card, CardContent, CardDescription} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import Stepper from "@/components/common/Stepper.tsx";
import {cn} from "@/lib/utils.ts";


export default function ActivationConfirmation({className, ...props}: React.ComponentProps<"div">) {

    return (
        <div className="flex flex-col justify-center items-center w-full gap-2 z-10 max-width-full">
            <Card className={cn("w-xl z-10  flex flex-col gap-6", className)} {...props}>
                <CardContent className="mt-4 font-paragraph flex flex-col items-center text-center gap-3">
                    <span
                        className="icon-[ph--check-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl"></span>
                    <Stepper totalSteps={4} currentStep={4}/>
                    <h2 className="text-2xl font-heading">
                        Activation email has been sent!
                    </h2>

                    <CardDescription className="flex flex-col gap-4">
                        <p className="text-paragraph">
                            We've sent an activation link to your email. Please check your
                            inbox (and spam folder) and click the link to activate your
                            account.
                        </p>

                        <p className="text-paragraph text-sm">
                            Didn&apos;t receive the email?{" "}
                            <Button
                                variant="link"
                                size="tight"
                                className="ml-auto"
                            >
                                Resend activation email
                            </Button>
                        </p>
                    </CardDescription>

                </CardContent>
            </Card>
        </div>
    )
}
