import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Control} from "react-hook-form";
import {PaymentFormValues} from "@/pages/NewPayment.tsx";

interface RecipientAccountInputProps {
    control: Control<PaymentFormValues>
}

export const RecipientAccountInput = ({ control }: RecipientAccountInputProps) => {
    return (
        <FormField control={control} name="recipientNumber" render={({ field }) => (
            <FormItem>
                <FormLabel>Recipient Account Number</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        placeholder="e.g. 987-6543210987654-32"
                        type="text"
                        required
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    );
};
