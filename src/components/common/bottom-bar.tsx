import * as React from "react";
import {cn} from "@/lib/utils.ts";

export function BottomBar({
    className,
    ...props}: React.ComponentProps<"div">){
    return(
        <div

            className={cn("flex justify-center self-stretch h-16 items-center border-t border-b border-border font-paragraph bg-background", className)} {...props}>

        </div>
    )
}