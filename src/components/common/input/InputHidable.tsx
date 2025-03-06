import * as React from "react";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

interface InputHideableProps extends Omit<React.ComponentProps<"input">, "id"> {
    id: string;
    placeholderVisible?: string;
}

export default function InputHidable({
                                         className,
                                         id,
                                         placeholder = "********",
                                         placeholderVisible = "abcdefgh",
                                         required = false,
                                         ...props
                                     }: InputHideableProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(prevState => !prevState);

    return (
        <div className={cn("relative", className)}>
            <Input
                id={id}
                type={isVisible ? "text" : "password"}
                placeholder={isVisible ? placeholderVisible: placeholder}
                required={required}
                {...props}
                className="pr-10"
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-2 flex items-center"
            >
                {isVisible ? (
                    <span className="icon-[ph--eye]" />
                ) : (
                    <span className="icon-[ph--eye-closed]" />
                )}
            </Button>
        </div>
    );
}
