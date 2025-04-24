import * as React from "react";
import {Card, CardContent, CardDescription} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationProps extends React.ComponentProps<"div"> {
    title?: string;
    beforeTitleContent?: React.ReactNode;
    description?: string;
    resendQuestion?: string;
    resendUrlText?: string;
    onUrlClick?: () => void;
    className?: string;
    cardProps?: React.ComponentProps<"div">;
    cardClassName?: string;
    iconClassName?: string;
    footer?: React.ReactNode;
}

export default function EmailConfirmation({
                                              title,
                                              beforeTitleContent,
                                              description,
                                              resendQuestion,
                                              resendUrlText,
                                              onUrlClick,
                                              className,
                                              cardProps,
                                              cardClassName,
                                              iconClassName,
                                              footer,
                                              ...props
                                          }: ConfirmationProps) {
    const [countdown, setCountdown] = React.useState<number | null>(null);
    const countdownDuration = 30; // seconds

    const handleResendClick = () => {
        if (onUrlClick) onUrlClick();
        setCountdown(countdownDuration); // Start 30 second countdown
    };

    React.useEffect(() => {
        if (countdown === null) return;

        if (countdown <= 0) {
            setCountdown(null); // Reset after countdown ends
            return;
        }

        const timer = setTimeout(() => setCountdown((prev) => (prev ?? 0) - 1), 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className={cn(" flex flex-col justify-center items-center w-full gap-2 z-10 max-width-full", className)} {...props}>
            <Card className={cn("bg-transparent border-0 shadow-none w-xl z-10 flex flex-col gap-6", cardClassName)} {...cardProps}>
                <CardContent className="mt-4 font-paragraph flex flex-col items-center text-center gap-3">
                    <span
                        className={cn("icon-[ph--check-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl", iconClassName)}
                    ></span>
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
                            {countdown === null ? (
                                <Button
                                    variant="link"
                                    size="tight"
                                    className="ml-auto"
                                    onClick={handleResendClick}
                                >
                                    {resendUrlText}
                                </Button>
                            ) : (
                                <span className="text-muted-foreground ml-auto">
                                    Email has been resent. Please wait {countdown}s
                                </span>
                            )}
                        </p>
                    </CardDescription>
                </CardContent>
                {footer}
            </Card>
        </div>
    );
}
