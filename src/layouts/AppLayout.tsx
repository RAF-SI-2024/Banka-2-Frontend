import { AppSidebar } from "@/components/__common__/sidebar/AppSidebar.tsx"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar.tsx"
import Footer from "@/components/__common__/Footer.tsx";
import HeaderWithThemeSwitch from "@/components/__common__/header/HeaderWithThemeSwitch.tsx";
import {Outlet} from "react-router-dom";

export default function AppLayout() {
    return (
        <SidebarProvider>
            {/*add sidebar*/}
            <AppSidebar />
            {/*part that the sidebar shrinks when open*/}
            <SidebarInset className="h-1">
                <HeaderWithThemeSwitch className="flex h-16 shrink-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                </HeaderWithThemeSwitch>

                <div className="max-w-[1200px] w-full mx-auto">
                 <Outlet />
                </div>

                <Footer/>

            </SidebarInset>
        </SidebarProvider>
    )
}
