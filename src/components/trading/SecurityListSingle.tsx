import {Security} from "@/types/exchange/security.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {formatPercentage} from "@/lib/format-number.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


interface SecuritySingleProps{
    security: Security;
}

export default function SecurityListSingle({security}: SecuritySingleProps) {
    const navigate = useNavigate();
    return (
        <Button variant="outline" onClick={() => navigate(`/trading/${security.id}`)}
                className="hover:bg-primary/30 bg-background/50 w-full h-full rounded-lg border-1 border-muted flex flex-row justify-between items-center px-2 py-2  my-1">
            <div className="flex flex-col items-baseline">
                <div className="font-bold text-foreground text-sm">
                    {security.name}
                </div>
                <div className="text-xs text-muted-foreground">
                    {formatCurrency(security.price, "RSD")}
                </div>
            </div>
            <div className={cn("text-xs font-light", security.priceChange > 0 ? "text-success": "", security.priceChange < 0 ? "text-destructive": "")}>
                {security.priceChange > 0? "+": ""}{formatPercentage(security.priceChange)}
            </div>
        </Button>
    );
};