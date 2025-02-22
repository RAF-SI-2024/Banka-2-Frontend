import { AppSidebar } from "@/components/common/app-sidebar.tsx"
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {Footer} from "@/components/common/footer.tsx";
import {ThemeSwitch} from "@/components/common/theme-switch.tsx";

export default function HomePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-1">
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4 justify-between w-full">
                        <SidebarTrigger className="-ml-1" />

                        <ThemeSwitch variant="ghost"></ThemeSwitch>
                        {/*<Breadcrumb>*/}
                        {/*    <BreadcrumbList>*/}
                        {/*        <BreadcrumbItem className="hidden md:block">*/}
                        {/*            <BreadcrumbLink href="#">*/}
                        {/*                Building Your Application*/}
                        {/*            </BreadcrumbLink>*/}
                        {/*        </BreadcrumbItem>*/}
                        {/*        <BreadcrumbSeparator className="hidden md:block" />*/}
                        {/*        <BreadcrumbItem>*/}
                        {/*            <BreadcrumbPage>Data Fetching</BreadcrumbPage>*/}
                        {/*        </BreadcrumbItem>*/}
                        {/*    </BreadcrumbList>*/}
                        {/*</Breadcrumb>*/}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
                <div>
                    <Footer/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
