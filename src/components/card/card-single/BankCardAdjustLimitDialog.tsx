import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {BankAccount} from "@/types/bank-account.ts";
import {editAccountClient} from "@/api/bank-account.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import VerificationOTP from "@/components/__common__/VerificationOTP.tsx";
import AdjustLimitsForm from "@/components/bank-account/bank-account-single/AdjustLimitsForm.tsx";
import OTPSuccessCard from "@/components/card/card-create/OTPSuccessNotifiaction.tsx";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";
import {CardDTO, CardUpdateLimitRequest} from "@/types/card.ts";
import BankCardAdjustLimisForm from "@/components/card/card-single/BankCardAdjustLimitForm.tsx";
import {editCardLimit} from "@/api/card.ts";

interface BankCardAdjustLimitsDialogProps {
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
    setLimit: (val: number) => void;
    card: CardDTO
}



export default function BankCardAdjustLimitDialog({showDialog, setShowDialog, setLimit, card}: BankCardAdjustLimitsDialogProps) {
    const [step, setStep] = useState(0);


    const formSchema = z.object({
        limit: z.preprocess(
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
            limit: card.limit,
        },
    });

    async function nextStepZero() {
        const isValid = await form.trigger([
            "limit",
        ])
        if (isValid) {
            setStep((prev) => prev + 1)
        }
    }

    async function nextStepOne() {
        const isValid = await form.trigger(["otp"]);

        if (isValid) {
            try {
                const payload: CardUpdateLimitRequest = {
                    limit: parseFloat(form.getValues().limit.toString().replace(/\./g, "").replace(",", "."))
                }
                const response = await editCardLimit(card.id, payload);
                showSuccessToast({title: "Edit successful", description: "Limit adjusted successfully!"})

                setStep((prev) => prev + 1);
                console.log(response);
                setLimit(response.limit ?? card.limit)
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
            <DialogContent className="min-w-fit" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                {step === 0 ? <BankCardAdjustLimisForm card={card} form={form} nextStep={nextStepZero}  /> : null}
                {step === 1 ? <VerificationOTP form={form} nextStep={nextStepOne}></VerificationOTP> : null}
                {step === 2 ? <OTPSuccessCard className="bg-transparent border-0 w-lg"
                                              title="Verification successful!"
                                              icon="icon-[ph--check-circle-fill]"
                                              message="Limit has been adjusted successfuly." /> : null}

                {/*TODO Ovde treba da se namesti logika za prikaz ove komponente, trenutno ako ne uspe zahtev samo se ispise greska ispod ovog dijaloga, a ne prikazuje se ekran*/}
                {step === 3 ? <OTPSuccessCard className="bg-transparent border-0 w-lg"
                                              title="Verification failed!"
                                              icon="icon-[ph--x-circle-fill]"
                                              message="Limit could not be adjusted." /> : null}

            </DialogContent>
        </Dialog>
    );

}