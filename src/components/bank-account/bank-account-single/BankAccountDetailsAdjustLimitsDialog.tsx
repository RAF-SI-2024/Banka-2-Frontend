import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import {editAccountClient} from "@/api/bank_user/bank-account.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import VerificationOTP from "@/components/__common__/VerificationOTP.tsx";
import AdjustLimitsForm from "@/components/bank-account/bank-account-single/AdjustLimitsForm.tsx";
import OTPSuccessCard from "@/components/card/card-create/OTPSuccessNotifiaction.tsx";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

interface BankAccountDetailsAdjustLimitsDialogProps {
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
    setMonthlyLimit: (val: number) => void;
    setDailyLimit: (val: number) => void;
    account: BankAccount
}



export default function BankAccountDetailsAdjustLimitsDialog({showDialog, setShowDialog, setMonthlyLimit, setDailyLimit, account}: BankAccountDetailsAdjustLimitsDialogProps) {
    const [step, setStep] = useState(0);


    const formSchema = z.object({
        monthlyLimit: z.preprocess(
            (val) => {
                if (typeof val === "string") {
                    if(val.length == 0)
                        return 0;
                    // Convert "231.323,00" -> 231323.00
                    return parseFloat(val.replace(/\./g, "").replace(",", "."));
                }
                return Number(val);
            },
            z.number()
                .min(1000, "Limit is too small")
                .max(10000000, "Limit is too big")
        ),
        dailyLimit: z.preprocess(
            (val) => {
                if (typeof val === "string") {
                    if(val.length == 0)
                        return 0;
                    // Convert "231.323,00" -> 231323.00
                    return parseFloat(val.replace(/\./g, "").replace(",", "."));
                }
                return Number(val);
            },
            z.number()
                .min(1000, "Limit is too small")
                .max(10000000, "Limit is too big")
        ),
        otp: z.string().length(6),
        name: z.string(),
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
        const isValid = await form.trigger(["otp"]);

        if (isValid) {
            try {
                const payload = {
                    name: account.name,
                    otp: form.getValues().otp,
                    dailyLimit: parseFloat(form.getValues().dailyLimit.toString().replace(/\./g, "").replace(",", ".")),
                    monthlyLimit: parseFloat(form.getValues().monthlyLimit.toString().replace(/\./g, "").replace(",", "."))
                }
                const response = await editAccountClient(account.id, payload);
                showSuccessToast({title: "Edit successful", description: "Limits adjusted successfully!"})

                if (response.status !== 200) {
                    throw new Error("API error");
                }
                setStep((prev) => prev + 1);

                setMonthlyLimit(response.data.monthlyLimit ?? account.monthlyLimit);
                setDailyLimit(response.data.dailyLimit ?? account.dailyLimit);
            } catch (err) {
                console.error(err);
                showErrorToast({error: err, defaultMessage: "Limits could not be adjusted."})
            }
        }
    }

    const handleDialogClose = (open: boolean) => {
        setShowDialog(open);
        if (!open) {
            setStep(0)
        }
    };

    return (
        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
            <DialogContent className="min-w-fit shadow-none" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                {step === 0 ? <AdjustLimitsForm account={account} form={form} nextStep={nextStepZero}  /> : null}
                {step === 1 ? <VerificationOTP form={form} nextStep={nextStepOne}></VerificationOTP> : null}
                {step === 2 ? <OTPSuccessCard className="bg-transparent border-0 w-lg"
                                              title="Verification successful!"
                                              icon="icon-[ph--check-circle-fill]"
                                              message="Limits have been adjusted successfuly." /> : null}

                {/*TODO Ovde treba da se namesti logika za prikaz ove komponente, trenutno ako ne uspe zahtev samo se ispise greska ispod ovog dijaloga, a ne prikazuje se ekran*/}
                {step === 3 ? <OTPSuccessCard className="bg-transparent border-0 w-lg"
                                              title="Verification failed!"
                                              icon="icon-[ph--x-circle-fill]"
                                              message="Limits could not be adjusted." /> : null}

            </DialogContent>
        </Dialog>
    );

}