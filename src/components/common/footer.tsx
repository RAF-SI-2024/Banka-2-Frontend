import {Separator} from "@/components/ui/separator.tsx"
import {ThemeSwitch} from "@/components/common/theme-switch.tsx";

export function Footer() {
    return (
        <footer className="bg-footer p-8">
            <nav aria-label="Page navigation" className="grid gap-y-6 gap-x-2 items-center justify-between w-full grid-cols-1">
                <div className="flex w-full justify-between items-center">
                <h1 className="font-display text-xl">BankToo</h1>
                    <ThemeSwitch></ThemeSwitch>
                </div>
                <div className="text-sm font-medium font-paragraph flex h-5 flex-row space-x-4 h text-footer-foreground items-center">

                    <a href="#" className="underline-offset-4 hover:underline hover:text-link-hover">
                        Home
                    </a>
                    {/*<Separator orientation="vertical" />*/}
                    {/*<a href="#" className="underline-offset-4 hover:underline hover:text-link-hover">*/}
                    {/*    Page1*/}
                    {/*</a>*/}
                    {/*<Separator orientation="vertical" />*/}
                    {/*<a href="#" className="underline-offset-4 hover:underline hover:text-link-hover">*/}
                    {/*    Page2*/}
                    {/*</a>*/}
                    {/*<Separator orientation="vertical" />*/}
                    {/*<a href="#" className="underline-offset-4 hover:underline hover:text-link-hover">*/}
                    {/*    Page3*/}
                    {/*</a>*/}

                </div>
                <p className="text-muted-foreground text-xs font-paragraph font-extralight">© 2025, All rights reserved</p>

            </nav>
        </footer>
    );
}