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
import PayerAccountSelect, { FetchedAccount } from "@/components/newPayment/PayerAccountSelect";
import VerificationOTP from "@/components/common/VerificationOTP";
import { z } from "zod";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import AddRecipientTemplate from "@/components/newPayment/AddRecipientTemplate";
import AmountInput from "@/components/newPayment/AmountInput.tsx";
import { fetchRecipientCurrencyId, fetchPaymentCodes, RawPaymentCode } from "@/api/transactionCode";
import {CreateTransactionRequest} from "@/types/transaction.ts";
import {createTransaction} from "@/api/transactions.ts";

export const paymentSchema = z.object({
    recipientAccount: z
        .string()
        .regex(/^\d{18}$/, "Recipient account must be exactly 18 digits")
        .min(18, "Recipient account must be exactly 18 digits")
        .max(18, "Recipient account must be exactly 18 digits"),
    amount: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if (val.length === 0) return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(1000, "Amount is too small")
            .max(500000000, "Amount is too big")
    ),
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

function NewPaymentPage() {
    const form = useForm<PaymentFormValues>({
        mode: "onChange",
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

    const watch = form.watch;

    const [isLimitExceeded, setLimitExceeded] = useState(false);
    const [paymentLimit, setPaymentLimit] = useState(0);
    const [payerCurrency, setPayerCurrency] = useState<string>("RSD");
    const [step, setStep] = useState<"form" | "otp" | "success">("form");
    const [selectedAccount, setSelectedAccount] = useState<FetchedAccount | null>(null);
    const [toCurrencyId, setToCurrencyId] = useState<string | null>(null);
    const [loadingToCurrency, setLoadingToCurrency] = useState(false);
    const [paymentCodes, setPaymentCodes] = useState<RawPaymentCode[]>([]);
    const [transactionPayload, setTransactionPayload] = useState<CreateTransactionRequest>({
        fromAccountId: "",
        fromCurrencyId: "",
        toAccountNumber: "",
        toCurrencyId: "",
        amount: 0,
        codeId: "",
        referenceNumber: "",
        purpose: "",
    });

    useEffect(() => {
        const subscription = watch((value) => {
            const recipientAccount = value.recipientAccount?.trim().substring(7,16);
            console.log(recipientAccount)
            if (!recipientAccount) return;

            const timeout = setTimeout(() => {
                setLoadingToCurrency(true);

                fetchRecipientCurrencyId(recipientAccount)
                    .then((currencyId) => {
                        if (currencyId) {
                            setToCurrencyId(currencyId);
                            console.log("toCurrencyId set:", currencyId);
                        } else {
                            console.warn("Currency ID not found in account response.");
                            setToCurrencyId(null);
                        }
                    })
                    .catch((err) => {
                        console.error("Error fetching recipient account:", err);
                        setToCurrencyId(null);
                    })
                    .finally(() => {
                        setLoadingToCurrency(false);
                    });
            }, 500); // debounce delay (ms)

            return () => clearTimeout(timeout);
        });

        const loadPaymentCodes = async () => {
            try {
                const codes = await fetchPaymentCodes();
                console.log("Fetched payment codes:", codes);
                setPaymentCodes(codes);
            } catch (err) {
                console.error("Failed to load payment codes:", err);
            }
        };

        loadPaymentCodes();

        return () => {
            subscription.unsubscribe();
        };
    }, [watch]);

    const onSubmit = async (values: PaymentFormValues) => {
        const code = values.paymentCode?.trim() || "289";
        const matchingCode = paymentCodes.find((c) => c.code === code);
        const codeId = matchingCode?.id;

        if (!codeId) {
            alert(`Code ${code} not found in loaded payment codes.`);
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
            amount: values.amount || 0,
            codeId: codeId,
            referenceNumber: values.referenceNumber || "",
            purpose: values.purpose,
        };

        setTransactionPayload(payload)

        console.log("Submitting payment:", payload);
        setStep("otp");
    };

    async function handleOTPConfirmed (){
        console.log("OTP confirmed, payment finalized!");
        await createTransaction(transactionPayload);
        setStep("success");
    }

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
                                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
                                    {/* PayerAccountSelect */}
                                    <PayerAccountSelect
                                        control={form.control}
                                        onLimitChange={(limit) => {
                                            setPaymentLimit(limit);
                                            form.setValue("amount", 0);
                                        }}
                                        onCurrencyChange={(code) => setPayerCurrency(code)}
                                        onSelectAccount={(account) => {
                                            setSelectedAccount(account);
                                        }}
                                    />

                                    {/* Strelica */}
                                    <div className="flex items-center justify-center h-[40px] mt-5">
                                        <span
                                            className="icon-[ph--arrow-right-light] text-2xl leading-none text-muted-foreground"/>
                                    </div>

                                    <div className="flex-1">
                                        <RecipientInput control={form.control} ></RecipientInput>
                                    </div>
                                </div>


                                <AmountInput
                                    control={form.control}
                                    limit={paymentLimit}
                                    onLimitExceeded={setLimitExceeded}
                                    account={selectedAccount}
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
                                    disabled={!form.formState.isValid || !toCurrencyId}
                                >
                                    Continue
                                </Button>

                  {/*              {Object.keys(form.formState.errors).length > 0 && (*/}
                  {/*                  <pre className="text-red-500 text-xs">*/}
                  {/*  {JSON.stringify(form.formState.errors, null, 2)}*/}
                  {/*</pre>*/}
                  {/*              )}*/}
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
