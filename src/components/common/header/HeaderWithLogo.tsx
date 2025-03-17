import Logo from "@/assets/Logo.tsx";
import * as React from "react";
import {cn} from "@/lib/utils.ts";

export default function HeaderWithLogo({
    className,
    children,
    ...props
}: React.ComponentProps<"header">){
    return(
        <header
            className={cn("flex px-4 self-stretch h-16 items-center  font-paragraph bg-background", className)} {...props}>
            <nav className="flex justify-between items-center w-full h-full">

                {/*<Label className="font-display text-3xl my-4">*/}
                {/*    BankToo*/}
                {/*</Label>*/}
                <a href="/home" className="my-4 h-full">
                    <Logo className="size-full hover:animate-pulse"></Logo>
                </a>

                {children}

            </nav>
        </header>
    )
}