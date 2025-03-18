import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PaymentFormField } from "@/components/newPayment/PaymentForm";
import { RecipientInput } from "@/components/newPayment/RecipientInput";
import { useEffect, useState } from "react";
import PayerAccountSelect, {
    AccountCurrency,
    FetchedAccount
} from "@/components/newPayment/PayerAccountSelect";
import VerificationOTP from "@/components/common/VerificationOTP";
import { z } from "zod";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import AddRecipientTemplate from "@/components/newPayment/AddRecipientTemplate";
import AmountInputWithInfo from "@/components/newPayment/AmountInputWithInfo";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";

export const paymentSchema = z.object({
    recipientAccount: z.string().min(1, "Recipient account is required."),
    amount: z.coerce.number().positive("Amount must be greater than 0.").optional(),
    referenceNumber: z
        .string()
        .max(20, "Maximum 20 characters.")
        .regex(/^[0-9-]*$/, "Only numbers and '-' are allowed")
        .optional()
        .or(z.literal("")),
    paymentCode: z.string().optional(),
    purpose: z.string().min(1, "Payment purpose is required."),
    payerAccount: z.string().min(1, "Payer account is required."),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

function getTransactionCodeIdFromSession(code: string): string | null {
    const raw = sessionStorage.getItem("vite-ui-data");
    if (!raw) return null;

    try {
        const list = JSON.parse(raw);
        const match = list.find((item: { code: string }) => item.code === code);
        return match?.id ?? null;
    } catch (err) {
        console.error("❌ Error parsing sessionStorage transaction codes:", err);
        return null;
    }
}

function NewPaymentPage() {
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentCode: "289",
            recipientAccount: "",
            amount: undefined,
            payerAccount: "",
            purpose: "",
            referenceNumber: "",
        },
    });

    const { token } = useAuth();
    const watch = form.watch;

    const [isLimitExceeded, setLimitExceeded] = useState(false);
    const [paymentLimit, setPaymentLimit] = useState(0);
    const [payerCurrency, setPayerCurrency] = useState<string>("RSD");
    const [step, setStep] = useState<"form" | "otp" | "success">("form");
    const [selectedAccount, setSelectedAccount] = useState<FetchedAccount | null>(null);
    const [toCurrencyId, setToCurrencyId] = useState<string | null>(null);
    const [loadingToCurrency, setLoadingToCurrency] = useState(false);

    // Fetch currency ID when recipientAccount changes
    useEffect(() => {
        const subscription = watch((value) => {
            const recipientAccount = value.recipientAccount?.trim();
            if (!recipientAccount) return;

            setLoadingToCurrency(true);

            api.get("/accounts", {
                params: { Number: recipientAccount },
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            })
                .then((response) => {
                    const account = response.data.items?.[0];

                    const currencyId =
                        account?.accountCurrencies?.find((c: AccountCurrency) => c.currency?.id)?.currency?.id ??
                        account?.currency?.id ?? null;

                    if (currencyId) {
                        setToCurrencyId(currencyId);
                        console.log("✅ toCurrencyId set:", currencyId);
                    } else {
                        console.warn("⚠️ Currency ID not found in account response.");
                        setToCurrencyId(null);
                    }
                })
                .catch((err) => {
                    console.error("❌ Error fetching recipient account:", err);
                    setToCurrencyId(null);
                })
                .finally(() => {
                    setLoadingToCurrency(false);
                });
        });

        return () => subscription.unsubscribe();
    }, [watch, token]);

    const onSubmit = async (values: PaymentFormValues) => {
        const code = values.paymentCode?.trim() || "289";
        const codeId = getTransactionCodeIdFromSession(code);

        if (!codeId) {
            alert(`Code ${code} not found.`);
            return;
        }

        if (!selectedAccount?.id || !selectedAccount.currency?.id) {
            alert("Payer account is missing or invalid.");
            return;
        }

        if (loadingToCurrency) {
            alert("Please wait, fetching recipient currency...");
            return;
        }

        if (!toCurrencyId) {
            alert("Recipient account is invalid or does not have a valid currency.");
            return;
        }

        const payload = {
            fromAccountId: selectedAccount.id,
            fromCurrencyId: selectedAccount.currency.id,
            toAccountNumber: values.recipientAccount,
            toCurrencyId: toCurrencyId,
            amount: values.amount,
            codeId: codeId,
            referenceNumber: values.referenceNumber,
            purpose: values.purpose
        };

        console.log("✅ Submitting payment:", payload);
        setStep("otp");
    };

    const handleOTPConfirmed = () => {
        console.log("✅ OTP confirmed, payment finalized!");
        setStep("success");
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            {step === "form" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">New Payment</CardTitle>
                        <CardDescription>
                            Fill out the details to initiate a new payment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="flex flex-wrap gap-4 items-end">
                                    <div className="min-w-[240px] flex-1">
                                        <PayerAccountSelect
                                            control={form.control}
                                            onLimitChange={(limit) => {
                                                setPaymentLimit(limit);
                                                form.setValue("amount", undefined);
                                            }}
                                            onCurrencyChange={(code) => setPayerCurrency(code)}
                                            onSelectAccount={(account) => {
                                                setSelectedAccount(account);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-center pt-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 256 256"
                                            fill="currentColor"
                                            className="text-muted-foreground"
                                        >
                                            <path d="m220.24 132.24l-72 72a6 6 0 0 1-8.48-8.48L201.51 134H40a6 6 0 0 1 0-12h161.51l-61.75-61.76a6 6 0 0 1 8.48-8.48l72 72a6 6 0 0 1 0 8.48"/>
                                        </svg>
                                    </div>
                                    <div className="min-w-[240px] flex-1">
                                        <RecipientInput control={form.control} />
                                    </div>
                                </div>

                                <AmountInputWithInfo
                                    control={form.control}
                                    limit={paymentLimit}
                                    onLimitExceeded={setLimitExceeded}
                                    currency={payerCurrency}
                                />

                                <PaymentFormField
                                    name="referenceNumber"
                                    label="Reference Number (optional)"
                                    placeholder="97-1234567890123"
                                    maxLength={20}
                                    control={form.control}
                                />

                                <PaymentFormField
                                    name="purpose"
                                    label="Payment Purpose"
                                    placeholder="Utility bill"
                                    control={form.control}
                                />

                                <PaymentFormField
                                    name="paymentCode"
                                    label="Payment Code"
                                    placeholder="289"
                                    control={form.control}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLimitExceeded || loadingToCurrency || !toCurrencyId}
                                >
                                    {loadingToCurrency ? "Loading currency..." : "Continue"}
                                </Button>

                                {Object.keys(form.formState.errors).length > 0 && (
                                    <pre className="text-red-500 text-xs">
                                        {JSON.stringify(form.formState.errors, null, 2)}
                                    </pre>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            <Dialog open={step === "otp"} onOpenChange={(open) => !open && setStep("form")}>
                <DialogContent className="min-w-fit">
                    <DialogHeader>
                        <DialogTitle>OTP Verification</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code we just sent to your phone.
                        </DialogDescription>
                    </DialogHeader>
                    <VerificationOTP form={form} nextStep={handleOTPConfirmed} />
                </DialogContent>
            </Dialog>

            {step === "success" && (
                <AddRecipientTemplate
                    recipientAccount={form.getValues().recipientAccount}
                    existingRecipients={[
                        "RS35123456789012345678",
                        "RS98123456789098765432"
                    ]}
                />
            )}
        </div>
    );
}

export default NewPaymentPage;
