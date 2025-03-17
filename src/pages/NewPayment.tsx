import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { PaymentFormField } from "@/components/newPayment/PaymentForm";
import { PaymentCodeSelect } from "@/components/newPayment/PaymentCodeSelect";
import { RecipientInput } from "@/components/newPayment/RecipientInput.tsx";
import { AmountInputWithInfo } from "@/components/newPayment/AmountInputWithInfo.tsx";
import { useState } from "react";
import PayerAccountSelect from "@/components/newPayment/PayerAccountSelect.tsx";
import { RecipientAccountInput } from "@/components/newPayment/RecipientAccountInput.tsx";
import VerificationOTP from "@/components/common/VerificationOTP.tsx";
import { z } from "zod";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import AddRecipientTemplate from "@/components/newPayment/AddRecipientTemplate.tsx";

export const paymentSchema = z.object({
    recipientAccount: z.string().min(1, "Recipient account is required."),
    amount: z.coerce.number().positive("Amount must be greater than 0."),
    referenceNumber: z
        .string()
        .max(20, "Maximum 20 characters.")
        .regex(/^[0-9-]*$/, "Only numbers and '-' are allowed")
        .optional()
        .or(z.literal("")),
    paymentCode: z.string().optional(),
    purpose: z.string().min(1, "Payment purpose is required."),
    payerAccount: z.string().min(1, "Payer account is required."),
    recipientNumber: z.coerce.string().regex(/^[0-9-]*$/).min(1, "Recipient number is required."),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

function NewPaymentPage() {
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentCode: "289",
        },
    });

    const watch = form.watch;
    const [isLimitExceeded, setLimitExceeded] = useState(false);
    const [paymentLimit, setPaymentLimit] = useState(0)

    const [step, setStep] = useState<"form" | "otp" | "success">("form");

    function onSubmit(values: PaymentFormValues) {
        console.log("submitting...") // ← ovo treba da vidiš u konzoli
        const payload = {
            ...values,
            recipientNumber: values.recipientNumber || "987-6543210987654-32",
            paymentCode: values.paymentCode || "289",
        };
        console.log("Form submitted:", payload);
        setStep("otp");
    }


    const handleOTPConfirmed = () => {
        console.log("OTP confirmed, payment finalized!");

        // TODO: Poziv API-ja za potvrdu plaćanja ako je potrebno

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
                                <RecipientInput control={form.control} />
                                <RecipientAccountInput control={form.control} />
                                <PayerAccountSelect
                                    control={form.control}
                                    onLimitChange={(limit) => {
                                        console.log("✅ New limit selected:", limit)
                                        setPaymentLimit(limit)
                                    }}
                                />
                                <AmountInputWithInfo
                                    control={form.control}
                                    watch={watch}
                                    limit={paymentLimit}
                                    onLimitExceeded={setLimitExceeded}
                                />
                                <PaymentFormField
                                    name="referenceNumber"
                                    label="Reference Number (optional)"
                                    placeholder="e.g. 97-1234567890123"
                                    maxLength={20}
                                    control={form.control}
                                />
                                <PaymentFormField
                                    name="purpose"
                                    label="Payment Purpose"
                                    placeholder="e.g. Utility bill"
                                    control={form.control}
                                />
                                <PaymentCodeSelect control={form.control} />
                                <Button type="submit" className="w-full" disabled={isLimitExceeded}>
                                    Continue
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

                    <VerificationOTP
                        form={form}
                        nextStep={handleOTPConfirmed}
                    />
                </DialogContent>
            </Dialog>

            {step === "success" && (
                <AddRecipientTemplate
                    recipientAccount={form.getValues().recipientAccount}
                    recipientNumber={form.getValues().recipientNumber}
                    existingRecipients={[
                        "RS35123456789012345678",
                        "RS98123456789098765432"
                    ]} // zameniti stvarnim podacima
                />
            )}


        </div>
    );
}

export default NewPaymentPage;
