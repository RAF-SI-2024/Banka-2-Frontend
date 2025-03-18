import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"
import { PaymentFormValues } from "@/pages/NewPayment"
import api from "@/api/axios"
import { useAuth } from "@/hooks/useAuth.ts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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

const symbolToCurrencyCodeMap: Record<string, string> = {
    "$": "USD",
    "€": "EUR",
    "RSD": "RSD"
}

const PayerAccountSelect = ({
                                control,
                                onLimitChange,
                                onCurrencyChange,
                                onSelectAccount,
    }: PayerAccountSelectProps) => {
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
                console.error("Error loading accounts:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAccounts()
    }, [token])

    function getDisplayValues(acc: FetchedAccount) {
        const typeName = acc.type?.name ?? acc.name ?? "Account"
        const accountNumber = acc.accountNumber
        const accountCurrency = acc.accountCurrencies?.find((c) => c.currency?.symbol)
        const currencySymbol = accountCurrency?.currency?.symbol ?? acc.currency?.symbol ?? ""
        const availableBalance = accountCurrency?.availableBalance ?? acc.availableBalance ?? 0

        return `${typeName} – ${accountNumber} – ${availableBalance.toLocaleString()} ${currencySymbol}`
    }

    function extractLimit(acc: FetchedAccount): number {
        const accountCurrencyLimit = acc.accountCurrencies?.find((c) => c.dailyLimit > 0)?.dailyLimit
        return accountCurrencyLimit ?? acc.dailyLimit ?? 0
    }

    return (
        <div className="form-field">
            <Label>Your Account</Label>
            <Controller
                name="payerAccount"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(val) => {
                            console.log("Izabrani accountNumber:", val)
                            field.onChange(val)

                            const selected = accounts.find((a) => String(a.accountNumber) === val)
                            console.log("Pronađen selected account:", selected)

                            const limit = selected ? extractLimit(selected) : 0
                            const accountCurrency = selected?.accountCurrencies?.find((c) => c.currency?.symbol)
                            const symbol = accountCurrency?.currency?.symbol ?? selected?.currency?.symbol ?? "RSD"
                            const code = symbolToCurrencyCodeMap[symbol] || "RSD"

                            console.log("Limit:", limit)
                            console.log("Currency symbol:", symbol)
                            console.log("Currency code:", code)

                            onLimitChange(limit)
                            onCurrencyChange(code)

                            if (selected && onSelectAccount) {
                                console.log("Pozivam onSelectAccount sa:", selected)
                                onSelectAccount(selected)
                            }
                        }}
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