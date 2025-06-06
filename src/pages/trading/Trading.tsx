import {Toaster} from "@/components/ui/sonner.tsx";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import SecurityListCard from "@/components/trading/SecurityListCard.tsx";
import SecurityDetailsCard from "@/components/trading/SecurityDetails.tsx";
import SecurityTradingTable from "@/components/trading/SecurityTradingTable.tsx";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import {useParams} from "react-router-dom";
import {
    getSecurityTypeFromString,
    QuoteSimpleResponse,
    Security,
    SecurityDailyResponse,
    SecurityType
} from "@/types/exchange/security.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import Loader from "@/components/__common__/Loader.tsx";
import ErrorFallback from "@/components/__common__/error/ErrorFallback.tsx";
import TradingViewChart, {TradingChartRef} from "@/components/trading/TradingViewChart.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Card} from "@/components/ui/card.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {getAllSecuritiesOfType, getSecurityOfType, getSecurityOfTypeDaily} from "@/api/exchange/security.ts";
import {Datafeed} from "@/components/trading/TradingViewChartFunctions.ts";
import {CandleGenerator, useRealtimeCandleGenerator} from "@/hooks/use-candle-data.ts";

export default function Trading() {
    const { securityId, securityType } = useParams();

    const [loading,  setLoading]  = useState(true);
    const [error, setError] = useState("")
    const [security, setSecurity] =  useState<SecurityDailyResponse>();
    const [queueTrigger, setQueueTrigger] = useState(0);








    useEffect(() => {

        const fetchData = async () => {
            try {

                setLoading(true);
                let res;
                // If on "/trading" (no securityId), update the URL without triggering a re-fetch
                if (!securityId || securityType===undefined) {
                    const data = (await getAllSecuritiesOfType(SecurityType.Stock, 1, 1)).items;

                    if(data.length > 0) {
                        window.history.replaceState(null, "", `/trading/stock/${data[0].id}`);
                        res = await getSecurityOfTypeDaily(SecurityType.Stock, data[0].id);

                    }
                } else {
                    res = await getSecurityOfTypeDaily( getSecurityTypeFromString(securityType), securityId);
                }

                setSecurity(res);
            }
            catch (error){
                showErrorToast({error, defaultMessage: "Failed to fetch trading data."});
                setError(error ? error.toString(): "Failed to fetch trading data.");
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [securityId, securityType]);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full max-w-screen-2xl mx-auto">
            <Toaster richColors />
            {loading ?
                (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1}}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-shadow/50 "
                            >
                                <Loader />
                            </motion.div>
                        </AnimatePresence>
                        <TradingInfoSkeleton />
                    </>
                ) :
                (
                    error || !security ?  (<ErrorFallback message={error} />) :
                        (
                            <TradingInfo trigger={queueTrigger} setTrigger={setQueueTrigger} data={security} securityType={securityType ? getSecurityTypeFromString(securityType) : SecurityType.Stock}/>
                        )
                )}
        </main>
    );
}





function TradingInfo({data, securityType, trigger, setTrigger }: {data: SecurityDailyResponse, securityType: SecurityType,
    trigger:number, setTrigger: React.Dispatch<React.SetStateAction<number>>}) {


    const messageQueueRef = useRef<QuoteSimpleResponse[]>([]);

    const generator = useRealtimeCandleGenerator(data.ticker, messageQueueRef, setTrigger);



    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    const datafeed = useMemo(() => new Datafeed(data.quotes), [data.quotes]);





    return(
        <>

            <div className="flex flex-row gap-2 items-baseline">
                <h1 className="font-display font-bold text-5xl -mb-4">
                    {data.ticker ? securityType == SecurityType.Forex ? data.ticker.substring(0, 3)
                        + "/" + data.ticker.substring(3) :
                        securityType == SecurityType.Option ? data.ticker.replace(/[0-9]/g, '') :
                            data.ticker : "Security"} Overview
                </h1>
                <h1 className="font-display font-light text-lg -mb-4 text-muted-foreground">
                    {data.stockExchange?.acronym || "NaN"}
                </h1>
            </div>
            <p className="text-base text-muted-foreground font-paragraph max-w-screen">
                {data.name}
            </p>

            <div className="grid lg:grid-rows-2 auto-rows-fr gap-4 lg:grid-cols-10 grid-cols-1 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                {/* Graph starts at row 1 and spans 3 rows */}
                {/*{data.ticker && data.quotes &&  <TradingViewChart currency={data.stockExchange.currency} ticker={data.ticker } quotes={data.quotes} className="lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full"/>}*/}


                {/*/!* Details start at row 4 to avoid overlap *!/*/}
                {/*<SecurityDetailsCard className="lg:row-start-2  lg:col-span-6 row-start-2 row-span-1 col-span-full" />*/}

                {/*<SecurityTradingTable className="lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 row-start-3 col-span-full" />*/}

                {/*{isDesktop ? (*/}

                {/*    <SecurityListCard className="lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2 col-span-full" />*/}
                {/*): (*/}
                {/*    <>*/}
                {/*        <div className="fixed bottom-4 right-4 transform translate-x-0 z-50 -mr-2 -mb-2">*/}
                {/*            <Button variant="default" className="rounded-full size-12" size="icon"  onClick={() => setIsDrawerOpen(true)} >*/}
                {/*                <span className="icon-[ph--list-bullets]"></span>*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*        /!* ShadCN Drawer for mobile *!/*/}
                {/*        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>*/}

                {/*            <DrawerContent className="bg-card !max-h-11/12">*/}
                {/*                <DrawerTitle></DrawerTitle>*/}
                {/*                <DrawerDescription></DrawerDescription>*/}
                {/*                <div className="p-4 w-full overflow-y-auto h-full">*/}
                {/*                    <SecurityListCard className="w-full" />*/}
                {/*                </div>*/}
                {/*                <DrawerFooter className="pt-2 self-center w-full max-w-3xl ">*/}
                {/*                    <DrawerClose asChild>*/}
                {/*                        <Button variant="outline" className="w-full">Close</Button>*/}
                {/*                    </DrawerClose>*/}
                {/*                </DrawerFooter>*/}
                {/*            </DrawerContent>*/}

                {/*        </Drawer>*/}
                {/*    </>*/}
                {/*)}*/}


                {data.ticker && data.quotes &&  <TradingViewChart
                    updateTrigger={trigger}
                    messageQueueRef={messageQueueRef}
                    datafeed={datafeed} generator={generator}
                    currency={data.stockExchange.currency} ticker={data.ticker } quotes={data.quotes}
                    className="lg:row-start-1 lg:col-span-7 lg:col-start-1 lg:row-span-1 row-span-1 row-start-1 md:col-span-full"/>}


                {/* Details start at row 4 to avoid overlap */}
                <SecurityDetailsCard className="lg:row-start-2  lg:col-span-7 row-start-2 row-span-1 col-span-full" />


                {isDesktop ? (

                    <SecurityListCard className="lg:col-start-8 lg:col-span-3 lg:row-start-1 lg:row-span-2 col-span-full" />
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
                <h1 className="font-display font-bold text-5xl text-transparent -mb-4">
                    Security (NASDAQ) Overview

                </h1>
            </Skeleton>
            <Skeleton className="w-fit">
                <p className="text-base font-paragraph text-transparent">
                    J.P. Morgan Exchange-Traded Fund Trust JPMorgan Fundamental Data Science Large Core ETF
                </p>
            </Skeleton>

            <div className="grid lg:grid-rows-2 auto-rows-fr gap-4 lg:grid-cols-10 h-full lg:max-w-dvw min-h-fit lg:max-h-fit max-w-full">
                {/*/!* Graph starts at row 1 and spans 3 rows *!/*/}
                <Card className="border-0 h-[400px] lg:row-start-1 lg:col-span-6 lg:col-start-3 lg:row-span-1 row-span-1 row-start-1 md:col-span-full" />

                <Card className="border-0 lg:row-start-2  lg:col-span-6 row-start-2 row-span-1 col-span-full" />

                <Card className="border-0 h-full lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 row-start-3 col-span-full" />

                {isDesktop ? (
                    <Card className="border-0 lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2 col-span-full" />
                ): (
                    <></>
                )}


            </div>
        </>
    )
}