import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import * as React from "react";
import CreateCardForm from "@/components/createCard/CreateCardForm.tsx";
import {BankAccount} from "@/types/bankAccount.ts";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createCard} from "@/api/card.ts";
import OTPSuccessCard from "@/components/createCard/OTPSuccessNotifiaction.tsx";
import VerificationOTP from "@/components/common/VerificationOTP.tsx";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";


interface CreateCardDialogProps {
    account: BankAccount;
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
}



export default function CreateCardDialog({account, showDialog, setShowDialog} : CreateCardDialogProps) {

    const [step, setStep] = useState(0);

    const formSchema = z.object({
        accountId: z.string(),
        name: z.string().min(3, "Name is required"),
        cardTypeId: z.string().min(1, "Card Type is required"), // Store type ID
        limit: z.coerce.number().min(1000, "Limit is too small").max(1000000, "Limit is too big"),
        status: z.boolean(),
        otp: z.string().length(6)
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            accountId: account.id,
            name: "Card",
            limit: 1000,
            cardTypeId: "",
            status: true,
        },
    });

    async function nextStepZero() {
        const isValid = await form.trigger([
            "accountId",
            "name",
            "cardTypeId",
            "limit",
            "status",
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

            try{

                const response = await createCard(form.getValues());


                if(response.status != 200){
                    throw new Error("API error");
                }
                setStep((prev) => prev + 1)
            }
            catch(err) {
                console.error(err);
                showErrorToast({error: err, defaultMessage: "Failed to create a card"});
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
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Create Credit Card</DialogTitle>
                </DialogHeader>
                {step === 0 ? <CreateCardForm account={account} form={form} nextStep={nextStepZero}  /> : null}
                {step === 1 ? <VerificationOTP form={form} nextStep={nextStepOne}></VerificationOTP> : null}
                {step === 2 ? <OTPSuccessCard className="bg-transparent border-0"
                                              title="Verification successful"
                                              icon="icon-[ph--check-circle-fill]"
                                              message="Card created successfully!" /> : null}

                {/*TODO Ovde treba da se namesti logika za prikaz ove komponente, trenutno ako ne uspe zahtev samo se ispise greska ispod ovog dijaloga, a ne prikazuje se ekran*/}
                {step === 3 ? <OTPSuccessCard className="bg-transparent border-0 w-lg"
                                              title="Verification failed!"
                                              icon="icon-[ph--x-circle-fill]"
                                              message="Card could not be created." /> : null}

            </DialogContent>
        </Dialog>
    );
}