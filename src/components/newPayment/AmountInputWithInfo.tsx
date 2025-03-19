import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"
import MoneyInput from "@/components/common/input/MoneyInput.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"

interface AmountInputWithInfoProps {
    control: Control<PaymentFormValues>
    limit: number
    currency: string
    onLimitExceeded: (val: boolean) => void
}

const AmountInputWithInfo = ({
                                 control,
                                 limit,
                                 currency,
                                 onLimitExceeded
                             }: AmountInputWithInfoProps) => {
    const [amount, setAmount] = useState<number | undefined>(undefined)
    const [showInfo, setShowInfo] = useState(false)

    const remaining = Math.round((limit - (amount ?? 0)) * 100) / 100

    useEffect(() => {
        onLimitExceeded(remaining < 0)
    }, [remaining, onLimitExceeded])

    const parseAmount = (val: string): number | undefined => {
        const parsed = parseFloat(val.replace(/\./g, "").replace(",", "."))
        return isNaN(parsed) ? undefined : Math.round(parsed * 100) / 100
    }

    return (
        <div className="form-field">
            <div className="flex items-center justify-between mb-1">
                <Label>Amount</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowInfo(prev => !prev)}
                                className="p-1 text-muted-foreground hover:bg-transparent"
                                title="More info"
                            >
                                <span className="icon-[ph--info]"></span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            Click for limit info
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                    <MoneyInput
                        {...field}
                        value={field.value ?? undefined}
                        onChange={(e) => {
                            const parsed = parseAmount(e.target.value)
                            setAmount(parsed)
                            field.onChange(parsed)
                        }}
                        currency={currency}
                        placeholder="Enter amount"
                    />
                )}
            />

            {showInfo && (
                <div className="mt-2 text-sm text-muted-foreground">
                    Your daily limit: <strong>{limit.toLocaleString()} {currency}</strong><br />
                    Remaining: <strong className={remaining < 0 ? "text-red-500" : ""}>{remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</strong>
                </div>
            )}

            {remaining < 0 && (
                <div className="mt-2 text-sm font-medium text-red-600">
                    You have exceeded your daily limit by {Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </div>
            )}
        </div>
    )
}

export default AmountInputWithInfo
