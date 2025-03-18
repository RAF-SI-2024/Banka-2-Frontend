import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";

interface EditTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    template: { id: string; name: string; accountNumber: string } | null;
    onConfirm: (name: string, accountNumber: string) => void;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({ open, onClose, template, onConfirm }) => {
    const [name, setName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

    useEffect(() => {
        if (template) {
            setName(template.name);
            setAccountNumber(template.accountNumber);
            setIsConfirmDisabled(false); // Ako je template popunjen, dugme za potvrdu nije onemogućeno
        }
    }, [template]);

    useEffect(() => {
        if (name === template?.name && accountNumber === template?.accountNumber) {
            setIsConfirmDisabled(true); // Ako su podaci isti, onemogući dugme
        } else {
            setIsConfirmDisabled(false); // Ako su podaci promenjeni, omogući dugme
        }
    }, [name, accountNumber, template]);

    const handleConfirm = () => {
        if (template) {
            onConfirm(name, accountNumber);
            onClose(); // Zatvori dijalog
        }
    };

    return (
        open && (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogTitle>Edit Template</DialogTitle>
                    <DialogDescription>
                        Here you can edit the template details such as name and account number.
                    </DialogDescription>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Template Name"
                    />
                    <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Account Number"
                    />
                    <DialogFooter>

                        <Button variant="negative" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleConfirm} disabled={isConfirmDisabled}>
                            Confirm edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
};

export default EditTemplateDialog;
