import {Separator} from "@/components/ui/separator.tsx"
import {ThemeSwitch} from "@/components/common/ThemeSwitch.tsx";
import * as React from "react";
import {cn} from "@/lib/utils.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export default function Footer({className, ...props} :
                       React.ComponentProps<"footer"> ) {
    const navigate = useNavigate();
    return (
        <footer className={cn("bg-footer p-8", className)} {...props}>
            <nav aria-label="Page navigation" className="grid gap-y-6 gap-x-2 items-center justify-between w-full grid-cols-1">
                <div className="flex w-full justify-between items-center">
                <h1 className="font-display text-xl">BankToo</h1>
                    <ThemeSwitch></ThemeSwitch>
                </div>
                <div className="text-sm font-medium font-paragraph flex h-5 flex-row space-x-4 h text-footer-foreground items-center">

                    <Button
                        className="p-0 text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-link-hover"
                        variant="link"
                        onClick={() => {
                        navigate("/home", { replace: true })
                    }}>
                        Home
                    </Button>
                    {/*<Separator orientation="vertical" />*/}
                    {/*...*/}

                </div>
                <p className="text-muted-foreground text-xs font-paragraph font-extralight">© 2025, All rights reserved</p>

            </nav>
        </footer>
    );
}