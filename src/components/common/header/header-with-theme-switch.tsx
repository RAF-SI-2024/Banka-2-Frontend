import * as React from "react";
import {cn} from "@/lib/utils.ts";
import {ThemeSwitch} from "@/components/common/theme-switch.tsx";

export default function HeaderWithThemeSwitch({
                                           className,
                                           children,
                                           ...props
                                       }: React.ComponentProps<"header">){
    return(
        <header
            className={cn("flex h-16 shrink-0 items-center gap-2", className)} {...props}>
            <div className="flex items-center gap-2 px-4 justify-between w-full">

                    {children}

                    <ThemeSwitch variant="ghost"></ThemeSwitch>
            </div>

        </header>
    )
}