import React, {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import SecurityCreateOrder from "@/components/securities/SecurityCreateOrder.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import SecurityFilters from "@/components/securities/SecurityFIlters.tsx";


interface SecurityDetailsProps extends React.ComponentProps<"div">{

}
export default function SecurityDetailsCard({className, ...props}: SecurityDetailsProps) {

    const [activeTab, setActiveTab] = useState<string>('market');


    return (
        <Card
            className={cn(
                "border-0 ",
                className
            )}
            {...props}
        >
            <CardHeader></CardHeader>
            <CardContent >
                <Card className="h-100">
                    <CardContent className="size-full flex items-center justify-center">
                        <h1>Graf</h1>
                    </CardContent>
                </Card>
            </CardContent>
            <CardFooter className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="font-paragraph w-full">
                <TabsList className="bg-card w-full md:flex-col justify-baseline lg:flex-row h-full">
                    <TabsTrigger value="market" className="w-full ">Market</TabsTrigger>
                    <TabsTrigger value="futures" className="w-full">Futures</TabsTrigger>
                    <TabsTrigger value="forex" className="w-full">Forex</TabsTrigger>
                    <TabsTrigger value="options" className="w-full">Options</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="p-2 flex flex-row w-full">
                    <SecurityCreateOrder direction="buy" variant={activeTab} />
                    <SecurityCreateOrder direction="sell" variant={activeTab} />
                </TabsContent>
            </Tabs>
            </CardFooter>

        </Card>
    );
}
