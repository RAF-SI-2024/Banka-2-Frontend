import * as React from "react";
import {Card, CardContent, CardDescription} from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

interface OTPSuccessProps extends React.ComponentProps<"div"> {
    title?: string;
    icon?: React.ReactNode;
    message?: string;
}

export default function OTPSuccessCard({ title, icon, message, className, ...props}: OTPSuccessProps)
{



    return (
            <Card className={cn("w-xl z-10 flex flex-col gap-6", className)} {...props}>
                <CardContent className="mt-4 font-paragraph flex flex-col items-center text-center gap-3">
                    <span
                        className={cn("inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl", icon)}
                    ></span>

                    <h2 className="text-2xl font-heading">
                        {title}
                    </h2>

                    <CardDescription className="flex flex-col gap-4">
                        <p className="text-paragraph">
                            {message}
                        </p>

                    </CardDescription>
                </CardContent>
            </Card>
    )
}
