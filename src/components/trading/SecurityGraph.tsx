import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import TradingViewChart from "./TradingViewChart.tsx";

interface SecurityGraphProps extends React.ComponentProps<"div"> {
    title: string,
}

export default function SecurityGraph({ title, className, ...props }: SecurityGraphProps) {
    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-full w-full p-0">
                <TradingViewChart title={title}/>
            </CardContent>
        </Card>
    );
}