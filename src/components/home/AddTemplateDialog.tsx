import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const templateSchema = z.object({
    name: z.string()
        .min(1, "Name is mandatory.")
        .max(32, "Name can't have more than 32 characters.")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Name can only have letters and spaces."),
    accountNumber: z.string()
        .length(18, "Account number must be exacly 18 characters long.")
        .regex(/^\d{18}$/, "Account number must contain only numbers.")
});

interface AddTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTemplate: (name: string, accountNumber: string) => void;
}

const AddTemplateDialog = ({ open, onOpenChange, onAddTemplate }: AddTemplateDialogProps) => {
    const [name, setName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [errors, setErrors] = useState<{ name?: string; accountNumber?: string }>({});

    const handleAdd = () => {
        const result = templateSchema.safeParse({ name, accountNumber });
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0],
                accountNumber: fieldErrors.accountNumber?.[0]
            });
            return;
        }

        onAddTemplate(name, accountNumber);
        setName("");
        setAccountNumber("");
        setErrors({});
    };

    return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>

                        <DialogHeader>
                            <DialogTitle>Add new template</DialogTitle>
                        </DialogHeader>

                <div className="space-y-4">
                     <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    <Input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
                </div>

                        <DialogFooter>
                                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                                <Button variant="success" onClick={handleAdd}>Submit</Button>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>
        );
};

export default AddTemplateDialog;
