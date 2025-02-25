import { AppSidebar } from "@/components/common/AppSidebar.tsx"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Footer from "@/components/common/Footer.tsx";
import HeaderWithThemeSwitch from "@/components/common/header/HeaderWithThemeSwitch.tsx";

export default function HomePage() {
    return (
        <SidebarProvider>
            {/*add sidebar*/}
            <AppSidebar />
            {/*part that the sidebar shrinks when open*/}
            <SidebarInset className="h-1">
                <HeaderWithThemeSwitch className="flex h-16 shrink-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                </HeaderWithThemeSwitch>

                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />

                </main>

                <Footer/>

            </SidebarInset>
        </SidebarProvider>
    )
}
