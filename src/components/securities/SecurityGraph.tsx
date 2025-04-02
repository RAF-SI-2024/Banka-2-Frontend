import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import TradingViewChart from "@/components/securities/TradingViewChart.tsx";
import {IChartApi} from "lightweight-charts";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
}

export default function SecurityGraph({ className, ...props }: SecurityGraphProps) {

    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-full w-full p-0 flex flex-col" >
                <ResizablePanelGroup direction="vertical" className="h-4" >
                {/* Top chart container */}
                <ResizablePanel minSize={20} className="w-full">
                    <TradingViewChart type="candle" />
                </ResizablePanel>
                
                {/* Divider */}
                <ResizableHandle withHandle className="min-h-0.5 bg-muted-foreground text-muted"/>

                
                {/* Bottom chart container */}
                <ResizablePanel minSize={20} defaultSize={30}  className="w-full" >
                    <TradingViewChart type="volume" />
                </ResizablePanel>
                </ResizablePanelGroup>
            </CardContent>
        </Card>
    );
}