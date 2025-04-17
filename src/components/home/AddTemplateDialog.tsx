import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form} from "@/components/ui/form.tsx";


interface AddTemplateDialogProps {
    form: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTemplate: (name: string, accountNumber: string) => void;
}

const AddTemplateDialog = ({ form, open, onOpenChange, onAddTemplate }: AddTemplateDialogProps) => {

    const onSubmit = (data: { name: string; accountNumber: string }) => {
        onAddTemplate(data.name, data.accountNumber);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>

                <Card className={cn("flex flex-col gap-6 bg-transparent border-0 shadow-none")}>
                    <CardContent className="mt-4 font-paragraph">
                        <h2 className="text-2xl font-heading font-semibold text-center mt-4 mb-8">Add a new template</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                                <FormField
                                    key="name"
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                               <Input placeholder="Template" {...field}></Input>
                                            </FormControl>
                                            <FormDescription>What do you want to name this template?</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    key="accountNumber"
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Account number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Template's account number" {...field}></Input>
                                            </FormControl>
                                            <FormDescription>Which account does this template apply to?</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => {
                                        form.reset();
                                        onOpenChange(false)
                                    }}>Cancel</Button>
                                    <Button type="submit" variant="gradient">Submit</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </DialogContent>
        </Dialog>
    );
};

export default AddTemplateDialog;