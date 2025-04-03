import { Toaster } from "@/components/ui/sonner.tsx";
import React, { useState } from "react";
import SecurityListCard from "@/components/trading/SecurityListCard.tsx";
import SecurityDetailsCard from "@/components/trading/SecurityDetails.tsx";
import SecurityGraph from "@/components/trading/SecurityGraph.tsx";
import SecurityTradingTable from "@/components/trading/SecurityTradingTable.tsx";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts"; // Make sure the ShadCN Drawer component is installed

const securities = [
    {
        name: "Security1",
    }
];

export default function Trading() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 1000px)");

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full max-w-screen-2xl mx-auto">
            <Toaster richColors />
            {!securities || securities.length === 0 ? (
                <h1 className="text-center text-2xl font-semibold text-destructive">
                    Failed to fetch securities
                </h1>
            ) : (
                <>
                    <h1 className="font-display font-bold text-5xl">
                        {securities[0].name} overview
                    </h1>

                    <div className="grid lg:grid-rows-2 auto-rows-min gap-4 lg:grid-cols-10 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                        {/* Graph starts at row 1 and spans 3 rows */}
                        <SecurityGraph title="SC1" className="lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full" />

                        {/* Details start at row 4 to avoid overlap */}
                        <SecurityDetailsCard className="lg:row-start-2  lg:col-span-6 row-start-2 row-span-1 col-span-full" />

                        <SecurityTradingTable className="lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 row-start-3 col-span-full" />

                        {isDesktop ? (

                                <SecurityListCard className="lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2 col-span-full" />
                        ): (
                            <>
                                <div className="fixed bottom-4 right-4 transform translate-x-0 z-50 -mr-2 -mb-2">
                                    <Button variant="default" className="rounded-full size-12" size="icon"  onClick={() => setIsDrawerOpen(true)} >
                                        <span className="icon-[ph--list-bullets]"></span>
                                    </Button>
                                </div>
                                {/* ShadCN Drawer for mobile */}
                                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>

                                    <DrawerContent className="bg-card !max-h-11/12">
                                        <DrawerTitle></DrawerTitle>
                                        <DrawerDescription></DrawerDescription>
                                        <div className="p-4 w-full overflow-y-auto h-full">
                                            <SecurityListCard className="w-full" />
                                        </div>
                                        <DrawerFooter className="pt-2 self-center w-full max-w-3xl ">
                                            <DrawerClose asChild>
                                                <Button variant="outline" className="w-full">Close</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>

                                </Drawer>
                            </>
                        )}


                    </div>


                </>
            )}
        </main>
    );
}
