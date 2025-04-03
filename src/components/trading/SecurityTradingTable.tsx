import {cn} from "@/lib/utils.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import React from "react";

interface SecurityTableProps extends React.ComponentProps<"div">{

}

export default function SecurityTradingTable({className, ...props}: SecurityTableProps){
    return (
        <Card
            className={cn(
                "border-0 min-h-fit max-h-full  flex flex-col",
                className
            )}

            {...props}
        >
            <CardContent className="size-full content-center">
               <h1 className="text-center">Tabela info koje su na grafu</h1>
            </CardContent>
        </Card>
    );
}