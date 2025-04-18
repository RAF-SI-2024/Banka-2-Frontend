import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PiggyBank from "@/assets/PiggyBank.tsx";
import {RadialChart} from "@/components/__common__/RadialChart.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";


interface BalanceCardProps extends React.ComponentProps<"div">{
    balance?: number,
    available_balance?: number,
    income?: number,
    expenses?: number,
    currencyCode?: string
    onSendClick?: () => void,
    onTransferClick?: () => void,
}

const BalanceCard = ({ balance=20000, available_balance=17500, income=0, expenses=0, currencyCode="RSD", onSendClick, onTransferClick, className, ...props }: BalanceCardProps) => {
    return (
        <Card
            className={cn(
                "border-0 p-6 flex flex-col lg:flex-row lg:items-center justify-between ",
                className
            )}
            {...props}
        >
            <div>
                <div className="justify-center w-full flex flex-col" >
                        <RadialChart   total_balance={balance} available_balance={available_balance} currencyCode={currencyCode} />
                {/*        <h6 className="font-medium text-4xl font-heading mb-1">{balance}</h6>*/}
                {/*        <p className="text-sm text-secondary-foreground font-paragraph">Total Balance</p>*/}


                    <div className="flex items-center justify-center lg:justify-start gap-7 py-9 font-paragraph">
                        <div className="flex items-center">
                            <Button variant="negative" className="cursor-auto" size="icon">
                                <span className="icon-[ph--arrow-up-fill] w-4 h-4 text-success" />
                            </Button>
                            <div className="ml-3">
                                <p className="text-sm font-semibold">{formatCurrency(income, currencyCode)}</p>
                                <p className="text-xs text-secondary-foreground">Income</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Button variant="negative" className="cursor-auto" size="icon">
                                <span className="icon-[ph--arrow-down-fill] w-4 h-4 text-destructive" />
                            </Button>
                            <div className="ml-3">
                                <p className="text-sm font-semibold">{formatCurrency(expenses, currencyCode)}</p>
                                <p className="text-xs text-secondary-foreground">Expenses</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-4">
                        <Button variant="primary" size="lg" onClick={onSendClick}>Send</Button>
                        <Button variant="negative" size="lg" onClick={onTransferClick}>Transfer</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center lg:justify-end pt-8 lg:pt-0">
                <PiggyBank className="size-full"/>
            </div>
        </Card>
    );
};

export default BalanceCard;