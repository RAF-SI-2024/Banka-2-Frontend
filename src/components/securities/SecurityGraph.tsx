import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import TradingViewChart from "@/components/securities/TradingViewChart.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
}

export default function SecurityGraph({ className, ...props }: SecurityGraphProps) {
    const [ratio, setRatio] = useState(0.7); // 70% top, 30% bottom
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

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

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!containerRef.current || !isDraggingRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newRatio = (moveEvent.clientY - rect.top) / rect.height;
            const limitedRatio = Math.max(0.2, Math.min(0.8, newRatio));
            setRatio(limitedRatio);
        };
        const handleMouseUp = () => {
            isDraggingRef.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-full w-full p-0 flex flex-col" ref={containerRef}>
                {/* Top chart container */}
                <div className="w-full" style={{ height: `calc(${ratio * 100}% - 1px)` }}>
                    <TradingViewChart
                        type="candle"
                        onTimeRangeChanged={handleCandleTimeRangeChanged}
                        setTimeScaleRef={(ts) => { candleTimeScaleRef.current = ts; }}
                    />
                </div>

                {/* Divider */}
                <div
                    className="w-full h-2 bg-slate-700 hover:bg-slate-600 cursor-ns-resize flex items-center justify-center z-10"
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-10 h-1 bg-slate-500 rounded-full"></div>
                </div>

                {/* Bottom chart container */}
                <div className="w-full" style={{ height: `calc(${(1 - ratio) * 100}% - 1px)` }}>
                    <TradingViewChart
                        type="volume"
                        onTimeRangeChanged={handleVolumeTimeRangeChanged}
                        setTimeScaleRef={(ts) => { volumeTimeScaleRef.current = ts; }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}