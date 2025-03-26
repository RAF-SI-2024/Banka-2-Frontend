import { useEffect, useMemo, useState } from "react";
import { Actuary, ActuaryType } from "@/types/actuary";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MoneyInput from "@/components/__common__/input/MoneyInput";
import { showErrorToast, showSuccessToast } from "@/lib/show-toast-utils";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const adminSchema = z.object({
    actuaryType: z.nativeEnum(ActuaryType),
    limit: z.number().gt(0, "Limit must be greater than zero"),
});

const employeeSchema = z.object({
    limit: z.number().gt(0, "Limit must be greater than zero"),
});

interface AdminFormValues extends z.infer<typeof adminSchema> {}
interface EmployeeFormValues extends z.infer<typeof employeeSchema> {}

type FormValues = AdminFormValues | EmployeeFormValues;

interface EditActuaryFormProps {
    actuary: Actuary;
    onClose: () => void;
    onSuccess?: () => void;
    currentUserRole: number;
}

export default function EditActuaryForm({ actuary, onClose, onSuccess, currentUserRole }: EditActuaryFormProps) {
    const isAdmin = currentUserRole === 1; // assuming 1 is admin
    const schema = isAdmin ? adminSchema : employeeSchema;

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: isAdmin
            ? { actuaryType: actuary.actuaryType, limit: actuary.limit }
            : { limit: actuary.limit },
    });

    const { control, handleSubmit, watch } = form;
    const hasChanges = watch("limit") !== actuary.limit || (isAdmin && watch("actuaryType") !== actuary.actuaryType);

    const onSubmit = async (values: FormValues) => {
        try {
            const updated = { ...actuary, ...values };
            console.log("Mock updateActuary:", updated);
            showSuccessToast({ title: "Updated successfully" });
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error("❌ Update failed:", error);
            showErrorToast({ error, defaultMessage: "Failed to update actuary" });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {isAdmin && (
                    <FormField
                        control={control}
                        name={"actuaryType" as const}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Actuary Type</FormLabel>
                                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={String(ActuaryType.None)}>None</SelectItem>
                                        <SelectItem value={String(ActuaryType.Supervisor)}>Supervisor</SelectItem>
                                        <SelectItem value={String(ActuaryType.Agent)}>Agent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={control}
                    name={"limit" as const}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Limit</FormLabel>
                            <FormControl>
                                <MoneyInput value={field.value} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="gradient" disabled={!hasChanges}>
                    Update
                </Button>
            </form>
        </Form>
    );
}
