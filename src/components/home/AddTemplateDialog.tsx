import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const templateSchema = z.object({
    name: z.string()
        .min(1, "Name is mandatory.")
        .max(32, "Name can't have more than 32 characters.")
        .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Name can only have letters and spaces."),
    accountNumber: z.string()
        .length(18, "Account number must be exactly 18 characters long.")
        .regex(/^\d{18}$/, "Account number must contain only numbers.")
});

interface AddTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTemplate: (name: string, accountNumber: string) => void;
}

const AddTemplateDialog = ({ open, onOpenChange, onAddTemplate }: AddTemplateDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: "",
            accountNumber: ""
        }
    });

    const onSubmit = (data: { name: string; accountNumber: string }) => {
        onAddTemplate(data.name, data.accountNumber);
        reset(); // Resetuje formu nakon uspešnog dodavanja
        onOpenChange(false); // Zatvori modal
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new template</DialogTitle>
                    <DialogDescription>
                        Here you can add a new template.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input placeholder="Name" {...register("name")} />
                        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Input placeholder="Account number" {...register("accountNumber")} />
                        {errors.accountNumber && <p className="text-destructive text-sm">{errors.accountNumber.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" variant="success">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTemplateDialog;