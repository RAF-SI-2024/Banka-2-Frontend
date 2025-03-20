import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";

const templateSchema = z.object({
    name: z.string()
        .min(1, "Name is mandatory.")
        .max(32, "Name can't have more than 32 characters.")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ]+( [0-9A-Za-zčČćĆžŽšŠđĐ]+)*$/, "Name can contain letters, numbers, and spaces (but spaces must be between words)."),
    accountNumber: z.string()
        .length(18, "Account number must be exactly 18 characters long.")
        .regex(/^\d{18}$/, "Account number must contain only numbers.")
});

interface EditTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    template: { id: string; name: string; accountNumber: string } | null;
    onConfirm: (name: string, accountNumber: string) => void;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({ open, onClose, template, onConfirm }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset
    } = useForm({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: template?.name || "",
            accountNumber: template?.accountNumber || ""
        }
    });

    useEffect(() => {
        if (template) {
            reset({
                name: template.name,
                accountNumber: template.accountNumber
            });
        }
    }, [template, reset]);

    const onSubmit = (data: { name: string; accountNumber: string }) => {
        if (template) {
            onConfirm(data.name, data.accountNumber);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogDescription>
                    Here you can edit the template details such as name and account number.
                </DialogDescription>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input placeholder="Template Name" {...register("name")} />
                        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Input placeholder="Account Number" {...register("accountNumber")} />
                        {errors.accountNumber && <p className="text-destructive text-sm">{errors.accountNumber.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={!isDirty}>
                            Confirm edit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTemplateDialog;