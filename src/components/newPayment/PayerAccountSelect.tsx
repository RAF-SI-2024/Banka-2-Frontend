import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import type { Control } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"
import api from "@/api/axios"
import { useAuth } from "@/hooks/useAuth.ts"

interface Currency {
    symbol: string
}

interface AccountCurrency {
    currency?: Currency | null
    availableBalance: number
    dailyLimit: number
}

interface FetchedAccount {
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
}

const PayerAccountSelect = ({ control, onLimitChange }: PayerAccountSelectProps) => {
    const [accounts, setAccounts] = useState<FetchedAccount[]>([])
    const [loading, setLoading] = useState(true)

    const { token } = useAuth()

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const response = await api.get("/accounts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                })

                const data = response.data
                setAccounts(data.items || [])
            } catch (err) {
                console.error("❌ Error loading accounts:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAccounts()
    }, [token])

    function getDisplayValues(acc: FetchedAccount) {
        const typeName = acc.type?.name ?? acc.name ?? "Account"
        const accountNumber = acc.accountNumber

        // Try to use accountCurrencies first if available
        const accountCurrency = acc.accountCurrencies?.find((c) => c.currency?.symbol)
        const currencySymbol = accountCurrency?.currency?.symbol ?? acc.currency?.symbol ?? ""
        const availableBalance = accountCurrency?.availableBalance ?? acc.availableBalance ?? 0

        return `${typeName} – ${accountNumber} – ${availableBalance.toLocaleString()} ${currencySymbol}`
    }

    function extractLimit(acc: FetchedAccount): number {
        // Try to extract dailyLimit from accountCurrencies if exists and > 0
        const accountCurrencyLimit = acc.accountCurrencies?.find((c) => c.dailyLimit > 0)?.dailyLimit
        return accountCurrencyLimit ?? acc.dailyLimit ?? 0
    }

    return (
        <Controller
            name="payerAccount"
            control={control}
            render={({ field }) => (
                <div className="form-field">
                    <label htmlFor="payerAccount" className="form-label">
                        Payer Account
                    </label>

                    <Select
                        onValueChange={(val) => {
                            field.onChange(val)
                            const selected = accounts.find((a) => String(a.accountNumber) === val)
                            const limit = selected ? extractLimit(selected) : 0
                            console.log("✅ New limit selected:", limit)
                            onLimitChange(limit)
                        }}
                        value={field.value || ""}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Payer Account" />
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
                </div>
            )}
        />
    )
}

export default PayerAccountSelect