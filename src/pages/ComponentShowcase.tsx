import {Button} from "@/components/ui/button";
import {AppSidebar} from "@/components/common/app-sidebar.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Footer} from "@/components/common/footer.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ThemeSwitch} from "@/components/common/theme-switch.tsx";

export default function ComponentShowcasePage(){
    return (
        <>
            <SidebarProvider>
            <AppSidebar />
                <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4 justify-between w-full">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>


                <div className="flex flex-wrap gap-10 m-4">
                    <Button variant="default">default</Button>
                    <div className="bg-primary p-1 flex justify-center">
                        <Button variant="negative">negative</Button>
                    </div>
                    <Button variant="destructive">destructive</Button>
                    <Button variant="outline">outline</Button>
                    <Button variant="ghost">ghost</Button>
                    <Button variant="primary">primary</Button>
                    <Button variant="secondary">secondary</Button>
                    <Button variant="gradient">gradient</Button>
                    <Button variant="gradient_outline">gradient_outline</Button>
                    <Button variant="link">link</Button>
                </div>
                <div className="h-full flex items-center justify-center">
                    <Card className="flex flex-col w-100">
                        <CardHeader>
                            <CardTitle className="text-2xl">Naslov</CardTitle>
                            <CardDescription>
                                Ovo je kartica
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-row items-center">
                                    <Label className="w-auto">Promeni temu:</Label>
                                    <ThemeSwitch />
                                </div>


                                <div className="grid gap-3">
                                    <Label>Unesi nesto:</Label>
                                    <Input placeholder="cao"></Input>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Avatar className="size-8 rounded-lg">
                                <AvatarFallback className="rounded-lg icon-[ph--user-circle]"/>
                            </Avatar>

                            <span className="size-8 icon-[ph--bank]" />
                        </CardFooter>

                    </Card>


                </div>


                <div>
                    <Footer/>
                </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}