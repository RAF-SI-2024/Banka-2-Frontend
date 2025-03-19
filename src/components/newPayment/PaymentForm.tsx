import { Input } from "@/components/ui/input"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import type { Control, FieldPath } from "react-hook-form"
import {PaymentFormValues} from "@/pages/NewPayment.tsx";

interface PaymentFormFieldProps {
    name: FieldPath<PaymentFormValues>
    label: string
    placeholder?: string
    type?: string
    maxLength?: number
    control: Control<PaymentFormValues>
}

export function PaymentFormField({
                                     name,
                                     label,
                                     placeholder,
                                     type = "text",
                                     maxLength,
                                     control
                                 }: PaymentFormFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const currentLength = String(field.value || "").length
                const isOverLimit = maxLength && currentLength >= maxLength

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input
                                type={type}
                                placeholder={placeholder}
                                maxLength={maxLength}
                                {...field}
                                className={isOverLimit ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                        </FormControl>
                        <div className="text-sm mt-1 flex justify-between text-muted-foreground">
                            {isOverLimit && (
                                <span className="text-red-500 text-sm">Maximum 20 characters reached</span>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}
