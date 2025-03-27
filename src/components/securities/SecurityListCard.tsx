import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Tabs} from "@/components/ui/tabs.tsx";
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SecurityInfiniteList from "@/components/securities/SecurityInfiniteList.tsx";
import SecurityFilters from "@/components/securities/SecurityFIlters";

export default function SecurityListCard({className, ...props}: React.ComponentProps<"div">) {


    const [activeTab, setActiveTab] = useState<string>('stocks');

    return (
        <Card
            className={cn(
                "border-0  flex flex-col",
                className
            )}

            {...props}
        >



            <Tabs value={activeTab} onValueChange={setActiveTab} className="font-paragraph w-full " >

                <CardHeader className="w-full p-1">
                    <TabsList className="bg-card w-full md:flex-col justify-baseline lg:flex-row h-full">
                        <TabsTrigger value="stocks" className="w-full ">Stocks</TabsTrigger>
                        <TabsTrigger value="futures" className="w-full">Futures</TabsTrigger>
                        <TabsTrigger value="forex" className="w-full">Forex</TabsTrigger>
                        <TabsTrigger value="options" className="w-full">Options</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="p-2">
                        <SecurityFilters variant={activeTab} />
                    </TabsContent>


                </CardHeader>
                <CardContent className="py-0 px-4 pb-4  max-h-svh  overflow-y-auto"  id="scrollableDiv">
                    <SecurityInfiniteList variant={activeTab} />
                </CardContent>
            </Tabs>
        </Card>
    );
}