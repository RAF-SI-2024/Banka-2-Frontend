import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {fetchAccountByNumber, getAllAccountsClient} from "@/api/bankAccount"
import {useAuth} from "@/hooks/useAuth.ts";

interface Currency {
    id: string
    symbol: string
    name?: string
    code?: string
}

export interface AccountCurrency {
    currency?: Currency | null
    availableBalance: number
    dailyLimit: number
}

export interface FetchedAccount {
    id: string
    accountNumber: string
    name?: string
    type?: {
        name: string
    }
    availableBalance?: number
    dailyLimit?: number
    currency?: Currency
    accountCurrencies?: AccountCurrency[]
}

interface PayerAccountSelectProps {
    control: Control<PaymentFormValues>
    onLimitChange: (limit: number) => void
    onCurrencyChange: (code: string) => void
    onSelectAccount?: (acc: FetchedAccount) => void
}

const PayerAccountSelect = ({
                                control,
                                onLimitChange,
                                onCurrencyChange,
                                onSelectAccount,
                            }: PayerAccountSelectProps) => {
    const [accounts, setAccounts] = useState<FetchedAccount[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth();

    useEffect(() => {
        async function fetchAccounts() {
            if (!user?.id) return;

            try {
                const response = await getAllAccountsClient(user.id);
                setAccounts(response.data.items || []);
            } catch (err) {
                console.error("Error loading client accounts:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAccounts();
    }, [user?.id]);

    const handleAccountChange = async (val: string, fieldOnChange: (val: string) => void) => {
        fieldOnChange(val);

        const selected = accounts.find((a) => String(a.accountNumber) === val);
        const limit = selected ? extractLimit(selected) : 0;
        onLimitChange(limit);

        if (selected) {
            try {
                const response = await fetchAccountByNumber(selected.accountNumber);
                const currencyCode =
                    response.data.items?.[0]?.accountCurrencies?.[0]?.currency?.code ??
                    response.data.items?.[0]?.currency?.code ??
                    "RSD";

                onCurrencyChange(currencyCode);

                if (onSelectAccount) {
                    onSelectAccount(selected);
                }
            } catch (err) {
                console.error("Failed to fetch currency by account number:", err);
                onCurrencyChange("RSD"); // fallback
            }
        }
    };

    function getDisplayValues(acc: FetchedAccount) {
        const typeName = acc.type?.name ?? acc.name ?? "Account"
        const accountNumber = acc.accountNumber
        const accountCurrency = acc.accountCurrencies?.[0]?.currency
        const currencySymbol = accountCurrency?.symbol ?? acc.currency?.symbol ?? ""
        const availableBalance =
            acc.accountCurrencies?.[0]?.availableBalance ?? acc.availableBalance ?? 0

        return `${typeName} – ${accountNumber} – ${availableBalance.toLocaleString()} ${currencySymbol}`
    }

    function extractLimit(acc: FetchedAccount): number {
        return acc.accountCurrencies?.[0]?.dailyLimit ?? acc.dailyLimit ?? 0
    }

    return (
        <div className="form-field">
            <Label>Your Account</Label>
            <Controller
                name="payerAccount"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(val) => handleAccountChange(val, field.onChange)}
                        value={field.value || ""}
                    >

                    <SelectTrigger>
                            <SelectValue placeholder="Select Your Account" />
                        </SelectTrigger>
                        <SelectContent>
                            {loading ? (
                                <SelectItem value="loading" disabled>
                                    Loading...
                                </SelectItem>
                            ) : (
                                accounts.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.accountNumber}>
                                        {getDisplayValues(acc)}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    )
}

export default PayerAccountSelect
