import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Control, UseFormWatch } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"

interface AmountInputWithInfoProps {
    control: Control<PaymentFormValues>
    watch: UseFormWatch<PaymentFormValues>
    limit: number
    onLimitExceeded: (exceeded: boolean) => void
}

export function AmountInputWithInfo({
                                        control,
                                        watch,
                                        limit,
                                        onLimitExceeded
                                    }: AmountInputWithInfoProps) {
    const [showInfo, setShowInfo] = useState(false)
    const amountValue = watch("amount") ?? 0
    const numeric = Number(amountValue) || 0
    const remaining = limit - numeric

    useEffect(() => {
        onLimitExceeded(numeric > limit)
    }, [numeric, limit, onLimitExceeded])

    return (
        <FormField
            control={control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g. 1000.00"
                                {...field}
                                className="pr-10 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowInfo((prev) => !prev)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:bg-transparent"
                            title="More info"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 256 256"
                                fill="currentColor"
                            >
                                <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12"/>
                            </svg>
                        </Button>
                    </div>
                    <FormMessage />
                    {showInfo && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            Your daily limit: <strong>{limit.toLocaleString()} RSD</strong>
                            <br />
                            Remaining:{" "}
                            <strong className={remaining < 0 ? "text-red-500" : ""}>
                                {remaining.toLocaleString()} RSD
                            </strong>
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}
