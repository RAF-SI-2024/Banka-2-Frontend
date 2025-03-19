import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription, DialogHeader
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";

interface EditTemplateDialogProps {
    form: any,
    open: boolean;
    onClose: () => void;
    template: { id: string; name: string; accountNumber: string } | null;
    onConfirm: (name: string, accountNumber: string) => void;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({form, open, onClose, template, onConfirm}) => {

    useEffect(() => {
        if (template) {
            form.reset({
                name: template.name,
                accountNumber: template.accountNumber
            });
        }
    }, [template]);

    const onSubmit = (data: { name: string; accountNumber: string }) => {
        if (template) {
            onConfirm(data.name, data.accountNumber);
            console.log(data);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>

                <Card className={cn("flex flex-col gap-6 bg-transparent border-0")}>
                    <CardContent className="mt-4 font-paragraph">
                        <h2 className="text-2xl font-heading font-semibold text-center mt-4 mb-8">Edit template</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                                <FormField
                                    key="name"
                                    name="name"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Template" {...field}></Input>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    key="accountNumber"
                                    name="accountNumber"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Account number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Template's account number" {...field}></Input>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => {
                                        form.reset();
                                        onClose();
                                    }}>Cancel</Button>
                                    <Button type="submit" variant="primary" >Confirm</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </DialogContent>
        </Dialog>
    );
};

export default EditTemplateDialog;