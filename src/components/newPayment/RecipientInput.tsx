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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 256 256"
                                            fill="currentColor"
                                        >
                                            <path d="M244.8 150.4a8 8 0 0 1-11.2-1.6A51.6 51.6 0 0 0 192 128a8 8 0 0 1-7.37-4.89a8 8 0 0 1 0-6.22A8 8 0 0 1 192 112a24 24 0 1 0-23.24-30a8 8 0 1 1-15.5-4A40 40 0 1 1 219 117.51a67.94 67.94 0 0 1 27.43 21.68a8 8 0 0 1-1.63 11.21M190.92 212a8 8 0 1 1-13.84 8a57 57 0 0 0-98.16 0a8 8 0 1 1-13.84-8a72.06 72.06 0 0 1 33.74-29.92a48 48 0 1 1 58.36 0A72.06 72.06 0 0 1 190.92 212M128 176a32 32 0 1 0-32-32a32 32 0 0 0 32 32m-56-56a8 8 0 0 0-8-8a24 24 0 1 1 23.24-30a8 8 0 1 0 15.5-4A40 40 0 1 0 37 117.51a67.94 67.94 0 0 0-27.4 21.68a8 8 0 1 0 12.8 9.61A51.6 51.6 0 0 1 64 128a8 8 0 0 0 8-8" />
                                        </svg>
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
