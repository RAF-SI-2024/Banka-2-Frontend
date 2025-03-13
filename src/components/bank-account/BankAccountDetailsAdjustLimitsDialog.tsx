import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {BankAccount} from "@/types/bankAccount.ts";
import {editAccountClient} from "@/api/bankAccount.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import SuccessNotificationCard from "@/components/createCard/SuccessNotificationCard.tsx";
import FailNotificationCard from "@/components/createCard/FailNotificationCard.tsx";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";
import AdjustLimitsOTP from "@/components/bank-account/AdjustLimitsOTP.tsx";
import AdjustLimitsForm from "@/components/bank-account/AdjustLimitsForm.tsx";

interface BankAccountDetailsAdjustLimitsDialogProps {
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
    account: BankAccount
}



export default function BankAccountDetailsAdjustLimitsDialog({showDialog, setShowDialog, account}: BankAccountDetailsAdjustLimitsDialogProps) {
    const [error, setError] = useState<{ id: number; title: string; description: string } | null>(null);
    const [step, setStep] = useState(0);


    const formSchema = z.object({
        monthlyLimit: z.coerce.number().min(1000, "Limit is too small").max(10000000, "Limit is too big"),
        dailyLimit: z.coerce.number().min(1000, "Limit is too small").max(1000000, "Limit is too big"),
        otp: z.string().length(6),
        name: z.string()
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            monthlyLimit: account.monthlyLimit,
            dailyLimit: account.dailyLimit,
            name: account.name,
        },
    });

    async function nextStepZero() {
        const isValid = await form.trigger([
            "dailyLimit",
            "monthlyLimit",
        ])

        if (isValid) {
            setStep((prev) => prev + 1)
        }
    }

    async function nextStepOne() {

        const isValid = await form.trigger([
            "otp"
        ])

        if (isValid) {

            try {
                setError(null);

                const response = await editAccountClient(account.id, form.getValues());
                console.log(form.getValues());
                if (response.status != 200) {
                    throw new Error("API error");
                }
                setStep((prev) => prev + 1)
            } catch (err) {
                console.error(err);
                setError({
                    id: Date.now(),
                    title: "Failed to adjust limits",
                    description: "An error occurred while processing your request.",
                });
            }

        }
    }

    const handleDialogClose = (open: boolean) => {
        setShowDialog(open);
        if (!open) {
            setStep(0)
            setError(null);
        }
    };

    return (
        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Credit Card</DialogTitle>
                </DialogHeader>
                {step === 0 ? <AdjustLimitsForm account={account} form={form} nextStep={nextStepZero}  /> : null}
                {step === 1 ? <AdjustLimitsOTP form={form} nextStep={nextStepOne} setErrors={setError}></AdjustLimitsOTP> : null}
                {step === 2 ? <SuccessNotificationCard></SuccessNotificationCard> : null}

                {/*TODO Ovde treba da se namesti logika za prikaz ove komponente, trenutno ako ne uspe zahtev samo se ispise greska ispod ovog dijaloga, a ne prikazuje se ekran*/}
                {step === 3 ? <FailNotificationCard></FailNotificationCard> : null}

                {error && [error].map((error) => (
                    <ErrorAlert
                        key={error.id}
                        title={error.title}
                        description={error.description}
                        onClose={() => setError(null)}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );

}