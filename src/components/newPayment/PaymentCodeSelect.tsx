import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import type { Control } from "react-hook-form";
import api from "@/api/axios.ts";
import { useData } from "@/context/TransactionCodes.tsx";
import {PaymentFormValues} from "@/pages/NewPayment.tsx";

interface RawPaymentCode {
    id: string;
    code: string;
    name: string;
}

interface PaymentCodeSelectProps {
    control: Control<PaymentFormValues>;
}

export function PaymentCodeSelect({ control }: PaymentCodeSelectProps) {
    const { token } = useAuth();
    const { data: storedPaymentCodes, setData } = useData();
    const [paymentCodes, setPaymentCodes] = useState<RawPaymentCode[]>([]); // Default to an empty array
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!storedPaymentCodes || storedPaymentCodes.toString().length === 0) {
            const fetchPaymentCodes = async () => {
                if (!token) {
                    console.error("No token available for authentication.");
                    return;
                }
                try {
                    const response = await api.get("transactions/codes", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json"
                        },
                        params: { page: 1, size: 100 }
                    });

                    const fetchedCodes = response.data.items || [];
                    const updatedCodes = fetchedCodes.some(
                        (code: RawPaymentCode) => code.code === "289"
                    )
                        ? fetchedCodes
                        : [
                            { id: "289", code: "289", name: "TRANSACTIONS AT CITIZENS' REQUEST" },
                            ...fetchedCodes
                        ];

                    setPaymentCodes(updatedCodes);
                    setData(updatedCodes);
                } catch (error) {
                    console.error("Error fetching payment codes:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPaymentCodes();
        } else {
            setPaymentCodes(storedPaymentCodes as RawPaymentCode[]);
            setIsLoading(false);
        }
    }, [token, storedPaymentCodes, setData]);

    return (
        <FormField
            control={control}
            name="paymentCode"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Payment Code</FormLabel>
                    <Select
                        value={field.value || "289"}
                        onValueChange={(value) => {
                            field.onChange(value);
                        }}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a code" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {isLoading ? (
                                <SelectItem value="loading" disabled>
                                    Loading...
                                </SelectItem>
                            ) : (
                                paymentCodes.map((item: RawPaymentCode) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.code} - {item.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
