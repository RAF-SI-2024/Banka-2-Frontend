import {getSecurityTypeName, Security, SecuritySimple, SecurityType} from "@/types/exchange/security.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {formatPercentage} from "@/lib/format-number.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


interface SecuritySingleProps{
    securityType: SecurityType;
    security: SecuritySimple;
}

export default function SecurityListSingle({securityType, security}: SecuritySingleProps) {
    const navigate = useNavigate();
    return (
        <Button variant="outline" onClick={() =>
            navigate(`/trading/${getSecurityTypeName(securityType).toLowerCase()}/${security.id}`)}
                className="hover:bg-primary/30 bg-background/50 w-full h-full rounded-lg border-1 border-muted flex flex-row justify-between items-center px-2 py-2  my-1">
            <div className="flex flex-col items-baseline">
                <div className="font-bold text-foreground text-sm flex flex-row gap-1">
                    <div>
                        {security.ticker}
                    </div>
                    <div className="text-muted-foreground font-light">
                        ({security.stockExchange?.acronym || "NaN"})
                    </div>
                </div>
                <div className="text-xs text-muted-foreground">
                    {formatCurrency(security.askPrice, security.stockExchange ? security.stockExchange.currency.code : "RSD")}
                </div>
            </div>
            <div className={cn("text-xs font-light", security.priceChangePercentInInterval > 0 ? "text-success": "", security.priceChangePercentInInterval < 0 ? "text-destructive": "")}>
                {security.priceChangePercentInInterval > 0? "+": ""}{formatPercentage(security.priceChangePercentInInterval)}
            </div>
        </Button>
    );
};