import {Toaster} from "@/components/ui/sonner.tsx";
import React, {useEffect, useState} from "react";
import SecurityListCard from "@/components/trading/SecurityListCard.tsx";
import SecurityDetailsCard from "@/components/trading/SecurityDetails.tsx";
import SecurityGraph from "@/components/trading/SecurityGraph.tsx";
import SecurityTradingTable from "@/components/trading/SecurityTradingTable.tsx";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import {useNavigate, useParams} from "react-router-dom";
import {generateSecurities} from "@/mocks/trading/SecurityListMock.tsx";
import {Security, SecurityType} from "@/types/security.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import Loader from "@/components/__common__/Loader.tsx";


export default function Trading() {

    const { securityId } = useParams();
    const navigate = useNavigate();
    const [security, setSecurity] = useState<Security | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        async function fetchSecurities() {
            setIsLoading(true);

            try {
                // If on "/trading" (no securityId), update the URL without triggering a re-fetch
                if (!securityId) {
                    const data = await generateSecurities(SecurityType.Stock, 0, 1);

                    if(data.length > 0) {
                        window.history.replaceState(null, "", `/trading/${data[0].id}`);
                        setSecurity(data[0]);
                    }
                } else {
                    const data = await generateSecurities(SecurityType.Stock, 0, 100); // TODO: fetch only the security fith id
                    setSecurity(data.find(sec => sec.id === securityId) || null);
                }
            }
            catch (error){
                showErrorToast({error, defaultMessage: "Failed to fetch trading data."});
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchSecurities();
    }, [securityId]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-1000 ease-in-out">
                <Loader />
            </div>
        )
    }




    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full max-w-screen-2xl mx-auto">
            <Toaster richColors />
            {!security ? (
                <h1 className="text-center text-2xl font-semibold text-destructive">
                    Failed to fetch trading data
                </h1>
            ) : (
                <>
                    <h1 className="font-display font-bold text-5xl">
                        {security.name ? security.name : "Security"} Overview
                    </h1>

                    <div className="grid lg:grid-rows-2 auto-rows-min gap-4 lg:grid-cols-10 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                        {/* Graph starts at row 1 and spans 3 rows */}
                        <div className="lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full" >
                            <SecurityGraph title={security.name} /> {/* TODO: swap with security short name or smth */}
                        </div>

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
