import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";
import * as React from "react";
import SuccessNotificationCard from "@/components/createCard/SuccessNotificationCard.tsx";
import OTPForm from "@/components/createCard/OTPForm.tsx";
import FailNotificationCard from "@/components/createCard/FailNotificationCard.tsx";


interface CreateCardDialogProps {
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
}
export default function CreateCardDialog({showDialog, setShowDialog} : CreateCardDialogProps) {

    const [error, setError] = useState<{ id: number; title: string; description: string } | null>(null);
    const [step, setStep] = useState(1);

    const handleDialogClose = (open: boolean) => {
        setShowDialog(open);
        if (!open) {
            setStep(1)
            setError(null);
        }
    };

    return (
        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Credit Card</DialogTitle>
                </DialogHeader>
                {step === 1 ? <OTPForm setStep={setStep} setErrors={setError}></OTPForm> : null}
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