import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import TradingViewChart from "@/components/securities/TradingViewChart.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
}

export default function SecurityGraph({ className, ...props }: SecurityGraphProps) {
    const [ratio, setRatio] = useState(0.7); // 70% top, 30% bottom
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    
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
                    <TradingViewChart type="candle" />
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
                    <TradingViewChart type="volume" />
                </div>
            </CardContent>
        </Card>
    );
}