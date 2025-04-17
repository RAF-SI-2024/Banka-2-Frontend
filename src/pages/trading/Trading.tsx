import {Toaster} from "@/components/ui/sonner.tsx";
import React, {Suspense, useEffect, useState} from "react";
import SecurityListCard from "@/components/trading/SecurityListCard.tsx";
import SecurityDetailsCard from "@/components/trading/SecurityDetails.tsx";
import SecurityTradingTable from "@/components/trading/SecurityTradingTable.tsx";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import {useParams} from "react-router-dom";
import {generateSecurities} from "@/mocks/trading/SecurityListMock.tsx";
import {SecurityType} from "@/types/exchange/security.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import Loader from "@/components/__common__/Loader.tsx";
import {useQuery} from "react-query";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "@/components/__common__/error/ErrorFallback.tsx";
import TradingViewChart from "@/components/trading/TradingViewChart.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Card} from "@/components/ui/card.tsx";
import {AnimatePresence, motion} from "framer-motion";


export default function Trading() {
    const { securityId } = useParams();
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full max-w-screen-2xl mx-auto">
            <Toaster richColors />
            <ErrorBoundary fallbackRender={({ error }) => <ErrorFallback message={error.message} />}>
                <Suspense
                    key={securityId}
                    fallback={
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1}}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                            >
                                <Loader />
                            </motion.div>
                        </AnimatePresence>
                        <TradingInfoSkeleton />
                    </>
                }>
                    <TradingInfo securityId={securityId} />
                </Suspense>
            </ErrorBoundary>
        </main>
    );
}


async function fetchData(securityId?: string){
    try {
        let res;
        // If on "/trading" (no securityId), update the URL without triggering a re-fetch
        if (!securityId) {
            const data = await generateSecurities(SecurityType.Stock, 0, 1);

            if(data.length > 0) {
                window.history.replaceState(null, "", `/trading/${data[0].id}`);
                res = data[0];
            }
        } else {
            const data = await generateSecurities(SecurityType.Stock, 0, 100); // TODO: fetch only the security fith id
            res = data.find(sec => sec.id === securityId) || null;
        }
        return res;
    }
    catch (error){
        showErrorToast({error, defaultMessage: "Failed to fetch trading data."});
        throw error;
    }
}


function TradingInfo({securityId}: { securityId?: string }){
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1000px)");
    const { data } = useQuery(['security', securityId], () => fetchData(securityId), {
        suspense: true,
        useErrorBoundary: true,
    });

    if(!data)
        return;
    
    return(
        <>

            <h1 className="font-display font-bold text-5xl">
                {data.name ? data.name : "Security"} Overview
            </h1>

            <div className="grid lg:grid-rows-2 auto-rows-fr gap-4 lg:grid-cols-10 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                {/* Graph starts at row 1 and spans 3 rows */}
                <TradingViewChart title={data.name} className="lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full"/> {/* TODO: swap with security short name or smth */}

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
    )
}

function TradingInfoSkeleton(){
    const isDesktop = useMediaQuery("(min-width: 1000px)");



    return(
        <>
            <Skeleton className="w-fit" >
                <h1 className="font-display font-bold text-5xl text-transparent">
                Security Overview
                </h1>
            </Skeleton>

            <div className="grid lg:grid-rows-2 auto-rows-fr gap-4 lg:grid-cols-10 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                {/*/!* Graph starts at row 1 and spans 3 rows *!/*/}
                <Card className="border-0 h-[400px] lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full" />

                <Card className="border-0 lg:row-start-2  lg:col-span-6 row-start-2 row-span-1 col-span-full" />

                <Card className="border-0 h-[680px] lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 row-start-3 col-span-full" />

                {isDesktop ? (

                <Card className="border-0 lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2 col-span-full" />
                ): (
                    <></>
                )}


            </div>
        </>
    )
}