import {useState, useRef, useEffect} from 'react';
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import TradingViewChart from "@/components/securities/TradingViewChart.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
}

export default function SecurityGraph({ className, ...props }: SecurityGraphProps) {
    // Refs to store time scale methods
    const candleTimeScaleRef = useRef<{ setVisibleLogicalRange: (range: { from: number; to: number }) => void } | null>(null);
    const volumeTimeScaleRef = useRef<{ setVisibleLogicalRange: (range: { from: number; to: number }) => void } | null>(null);

    const [timeRange, setTimeRange] = useState<{ from: number; to: number } | null>(null);
    const lastUpdatedRef = useRef<'candle' | 'volume' | null>(null);


    // Handler for candle chart time range changes
    const handleCandleTimeRangeChanged = (range: { from: number; to: number }) => {
        if (lastUpdatedRef.current !== 'candle') {
            lastUpdatedRef.current = 'candle';
            setTimeRange(range);
        }
    };

    // Handler for volume chart time range changes
    const handleVolumeTimeRangeChanged = (range: { from: number; to: number }) => {
        if (lastUpdatedRef.current !== 'volume') {
            lastUpdatedRef.current = 'volume';
            setTimeRange(range);
        }
    };

    // Synchronize time ranges when timeRange state changes
    useEffect(() => {
        if (!timeRange) return;

        try {
            if (lastUpdatedRef.current === 'candle' && volumeTimeScaleRef.current) {
                volumeTimeScaleRef.current.setVisibleLogicalRange({
                    from: timeRange.from,
                    to: timeRange.to
                });
                // Reset after applying
                setTimeout(() => {
                    lastUpdatedRef.current = null;
                }, 10);
            } else if (lastUpdatedRef.current === 'volume' && candleTimeScaleRef.current) {
                candleTimeScaleRef.current.setVisibleLogicalRange({
                    from: timeRange.from,
                    to: timeRange.to
                });
                // Reset after applying
                setTimeout(() => {
                    lastUpdatedRef.current = null;
                }, 10);
            }
        } catch (error) {
            console.error("Error syncing time ranges:", error);
            lastUpdatedRef.current = null;
        }
    }, [timeRange]);


    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-full w-full p-0 flex flex-col" >
                <ResizablePanelGroup direction="vertical" className="h-4" >
                    {/* Top chart container */}
                    <ResizablePanel minSize={20} className="w-full">
                        <TradingViewChart
                            type="candle"
                            onTimeRangeChanged={handleCandleTimeRangeChanged}
                            setTimeScaleRef={(ts) => { candleTimeScaleRef.current = ts; }}
                        />
                    </ResizablePanel>

                    {/* Divider */}
                    <ResizableHandle withHandle className="min-h-0.5 bg-muted-foreground text-muted"/>


                    {/* Bottom chart container */}
                    <ResizablePanel minSize={20} defaultSize={30}  className="w-full" >
                        <TradingViewChart
                            type="volume"
                            onTimeRangeChanged={handleVolumeTimeRangeChanged}
                            setTimeScaleRef={(ts) => { volumeTimeScaleRef.current = ts; }}/>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </CardContent>
        </Card>
    );
}