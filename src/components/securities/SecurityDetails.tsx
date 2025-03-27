import React, {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Card} from "@/components/ui/card.tsx";
import SecurityCreateOrder from "@/components/securities/SecurityCreateOrder.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import SecurityGraph from "@/components/securities/SecurityGraph.tsx";


interface SecurityDetailsProps extends React.ComponentProps<"div">{

}
export default function SecurityDetailsCard({className, ...props}: SecurityDetailsProps) {

    const [activeTab, setActiveTab] = useState<string>('market');


    return (


            <Card className={cn("border-0 w-full", className)} {...props}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="font-paragraph w-full">
                    <TabsList className="bg-card w-fit md:flex-col justify-baseline lg:flex-row h-full">
                        <TabsTrigger value="market" className="w-full px-2">Market</TabsTrigger>
                        <TabsTrigger value="limit" className="w-full px-2">Limit</TabsTrigger>
                        <TabsTrigger value="stop" className="w-full px-2">Stop</TabsTrigger>
                        <TabsTrigger value="stop_limit" className="w-full px-2">Stop Limit</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="p-2  flex items-center flex-row w-full">
                        <SecurityCreateOrder direction="buy" variant={activeTab} />
                        <SecurityCreateOrder direction="sell" variant={activeTab} />
                    </TabsContent>
                </Tabs>
            </Card>
    );
}
