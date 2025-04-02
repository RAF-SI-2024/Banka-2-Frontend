import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import SynchronizedTradingChart from "./TradingViewChart.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
}

export default function SecurityGraph({ title, className, ...props }: SecurityGraphProps) {
    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-full w-full p-0">
                <SynchronizedTradingChart title={title || ""}/>
            </CardContent>
        </Card>
    );
}