import { useEffect, useState } from "react"
import { Control, useWatch } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"
import MoneyInput from "@/components/common/input/MoneyInput"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { FetchedAccount } from "@/components/newPayment/PayerAccountSelect"

interface AmountInputWithInfoProps {
    control: Control<PaymentFormValues>
    limit: number
    onLimitExceeded: (val: boolean) => void
    account: FetchedAccount | null
}

const AmountInput = ({
                                 control,
                                 limit,
                                 onLimitExceeded,
                                 account
                             }: AmountInputWithInfoProps) => {
    const watchedAmount = useWatch({ control, name: "amount" }) as string | number

    const [currency, setCurrency] = useState("RSD")

    useEffect(() => {
        const currencyFromAccount =
            account?.currency?.code ??
            account?.accountCurrencies?.[0]?.currency?.code ??
            "RSD";

        setCurrency(currencyFromAccount);
        console.log("💱 Detected currency:", currencyFromAccount);
    }, [account]);

    const numericValue =
        typeof watchedAmount === "string"
            ? parseFloat(watchedAmount.replace(/\./g, "").replace(",", "."))
            : watchedAmount

    return (
        <FormField
            name="amount"
            control={control}
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between mb-1">
                        <FormLabel>Amount</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="p-1 text-muted-foreground hover:bg-transparent"
                                        title="More info"
                                    >
                                        <span className="icon-[ph--info]" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Shows your daily payment limit
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <FormControl>
                        <MoneyInput
                            currency={currency || "RSD"}
                            onChange={field.onChange}
                            placeholder="Enter amount"
                            min={1000}
                            max={500000000}
                        />
                    </FormControl>

                    <FormMessage />

                    {limit > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            Daily limit:{" "}
                            <strong>
                                {limit.toLocaleString("sr-RS", {
                                    style: "currency",
                                    currency: currency,
                                })}
                            </strong>
                            <br />
                            Remaining:{" "}
                        </div>
                    )}


                </FormItem>
            )}
        />
    )
}

export default AmountInput
