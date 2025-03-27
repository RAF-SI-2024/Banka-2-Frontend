import { Input } from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {MouseEventHandler} from "react";
import {cn} from "@/lib/utils.ts";

interface SearchInputProps extends React.ComponentProps<"input">{
    onClear?: MouseEventHandler<HTMLButtonElement> | undefined;
    divClassName?: string;
}
export default function SearchFilter ({ value, onChange, onClear, divClassName, className}: SearchInputProps) {

    return (
        <div className={cn("relative w-full", divClassName)}>
            {/* Search Icon */}
            <span className="icon-[ph--magnifying-glass] absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />

            {/* Input Field */}
            <Input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search..."
                className={cn("pl-8 pr-8", className)}
            />

            {/* Custom 'X' Clear Button */}
            {value && (
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={onClear}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70"
                >
                    <span className="icon-[ph--x-bold] "/>
                </Button>
            )}
        </div>
    );
};
