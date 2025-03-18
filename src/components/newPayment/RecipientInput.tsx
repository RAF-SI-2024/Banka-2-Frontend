import { Input } from "@/components/ui/input"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Control } from "react-hook-form"
import { useState } from "react"
import { PaymentFormValues } from "@/pages/NewPayment.tsx"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"

interface RecipientInputProps {
    control: Control<PaymentFormValues>
}

export function RecipientInput({ control }: RecipientInputProps) {
    const [showRecipients, setShowRecipients] = useState(false)

    const handleClick = () => {
        setShowRecipients(prev => !prev)
        // TODO: Show actual recipient list
    }

    return (
        <FormField
            control={control}
            name="recipientAccount"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Recipient Account</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input
                                placeholder="123-4567890123456-89"
                                {...field}
                                className="pr-10"
                            />
                        </FormControl>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClick}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:bg-transparent"
                                    >
                                        <span className="icon-[ph--users-three]"></span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Show saved recipients
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <FormMessage />

                    {showRecipients && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            <p>→ Recipient list would show here...</p>
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}
