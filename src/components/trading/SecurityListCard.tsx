import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Tabs} from "@/components/ui/tabs.tsx";
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SecurityInfiniteList from "@/components/trading/SecurityInfiniteList.tsx";
import SecurityFilters from "@/components/trading/SecurityFIlters";
import {getSecurityTypePlural, SecurityType} from "@/types/security.ts";


export default function SecurityListCard({className, ...props}: React.ComponentProps<"div">) {


    const [activeTab, setActiveTab] = useState<SecurityType>(SecurityType.Stock);
    const [fetchFlag, setFetchFlag] = useState(false);

    return (
        <Card
            className={cn(
                "border-0 min-h-fit max-h-full  flex flex-col",
                className
            )}

            {...props}
        >



            <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(Number(value))} className="font-paragraph w-full " >

                <CardHeader className="w-full p-1">
                    <TabsList className="bg-card justify-center w-full flex flex-wrap  h-full lg:flex-row sm:flex-col">
                        <TabsTrigger value={SecurityType.Stock.toString()} className="w-full md:w-auto">{getSecurityTypePlural(SecurityType.Stock)}</TabsTrigger>
                        <TabsTrigger value={SecurityType.Future.toString()} className="w-full md:w-auto">{getSecurityTypePlural(SecurityType.Future)}</TabsTrigger>
                        <TabsTrigger value={SecurityType.Forex.toString()} className="w-full md:w-auto">{getSecurityTypePlural(SecurityType.Forex)}</TabsTrigger>
                        <TabsTrigger value={SecurityType.Option.toString()} className="w-full md:w-auto">{getSecurityTypePlural(SecurityType.Option)}</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab.toString()} className="p-2">
                        <SecurityFilters doFetch={() => setFetchFlag(!fetchFlag)} type={Number(activeTab)} />
                    </TabsContent>


                </CardHeader>
                <CardContent className="py-0 px-4 pb-4 max-h-[680px] min-h-[680px] overflow-y-auto"  id="scrollableDiv">
                    <SecurityInfiniteList fetchFlag={fetchFlag} scrollableId={"scrollableDiv"} type={Number(activeTab)} />
                </CardContent>
            </Tabs>
        </Card>
    );
}