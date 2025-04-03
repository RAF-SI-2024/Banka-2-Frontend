import { AppSidebar } from "@/components/__common__/sidebar/AppSidebar.tsx"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar.tsx"
import Footer from "@/components/__common__/Footer.tsx";
import HeaderWithThemeSwitch from "@/components/__common__/header/HeaderWithThemeSwitch.tsx";
import {Outlet} from "react-router-dom";
import {useEffect, useRef} from "react";

export default function SecurityLayout() {

    const triggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (triggerRef.current) {
            triggerRef.current.click();
        }
    }, []);


    return (
        <SidebarProvider>
            {/*add sidebar*/}
            <AppSidebar />
            {/*part that the sidebar shrinks when open*/}
            <SidebarInset>
                <HeaderWithThemeSwitch className="flex h-16 shrink-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1 z-100" ref={triggerRef} />
                </HeaderWithThemeSwitch>

                <div className="w-full mx-auto min-h-dvh">

                 <Outlet />

                </div>

                <Footer/>

            </SidebarInset>
        </SidebarProvider>
    )
}
