import * as React from "react";
import {Card, CardContent, CardDescription} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationProps extends React.ComponentProps<"div">{
    title?: string,
    beforeTitleContent?:React.ReactNode,
    description?: string,
    resendQuestion?: string,
    resendUrlText?: string,
    onUrlClick?: () => void
    className?: string,
    cardProps?: React.ComponentProps<"div">
    cardClassName?: string,
    iconClassName?: string,
}

export default function EmailConfirmation({ title, beforeTitleContent, description, resendQuestion, resendUrlText, onUrlClick, className, cardProps, cardClassName, iconClassName, ...props
                                          }: ConfirmationProps) {

    return (
        <div className={cn("flex flex-col justify-center items-center w-full gap-2 z-10 max-width-full", className)} {...props}>
            <Card className={cn("w-xl z-10  flex flex-col gap-6", cardClassName)} {...cardProps}>
                <CardContent  className="mt-4 font-paragraph flex flex-col items-center text-center gap-3">
          <span
              className={cn("icon-[ph--check-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl", iconClassName)}></span>
                    {beforeTitleContent}
                    <h2 className="text-2xl font-heading">
                        {title}
                    </h2>

                    <CardDescription className="flex flex-col gap-4">
                        <p className="text-paragraph">
                            {description}
                        </p>

                        <p className="text-paragraph text-sm">
                            {resendQuestion}{" "}
                            <Button
                                variant="link"
                                size="tight"
                                className="ml-auto"
                                onClick={onUrlClick}
                            >
                                {resendUrlText}
                            </Button>
                        </p>
                    </CardDescription>

                </CardContent>
            </Card>
        </div>
    );
}
