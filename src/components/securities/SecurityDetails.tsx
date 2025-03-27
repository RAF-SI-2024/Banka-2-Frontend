import React from "react";
import {cn} from "@/lib/utils.ts";
import {Card} from "@/components/ui/card.tsx";


export default function SecurityDetails({className, ...props}: React.ComponentProps<"div">) {
    return (
        <Card
            className={cn(
                "border-0 h-full p-6 flex flex-col lg:flex-row lg:items-center justify-center ",
                className
            )}
            {...props}
        >
        </Card>
    );
}
