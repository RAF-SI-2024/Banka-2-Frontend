import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, {useContext, useEffect, useState} from "react";
import {showErrorToast, showSuccessToast} from "@/utils/show-toast-utils.tsx";
import {getAccountById, getAllAccounts} from "@/api/bankAccount.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {createTransaction, getTransactionCodes} from "@/api/transactions.ts";
import {AuthContext} from "@/context/AuthContext.tsx";

const formSchema = z.object({
    bankAccount: z.string().min(8, "Account must have at least 8 digits"),
    recipientAccount: z.string().min(8, "Receiver account must have at least 8 digits"),
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    transactionCode: z.coerce.string(),
    referenceNumber: z.coerce.string(),
    purpose: z.coerce.string(),
});

export default function TransfersPage() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankAccount: "",
            recipientAccount: "",
            amount: "",
            transactionCode: "",
            referenceNumber: "",
            purpose: "",
        },
    });

    const [transactionCodes, setTransactionCodes] = useState([]);
    const [userAccounts, setUserAccounts] = useState([]);
    const context = useContext(AuthContext);

    useEffect(() => {
        async function fetchTransactionCodes() {
            try {
                const response = await getTransactionCodes(1,50);
                setTransactionCodes(response.items);
            } catch (error) {
                console.error("❌ Error while fetching transaction codes:", error);
                showErrorToast({ error, defaultMessage: "Transaction codes fetching failed" });
            }
        }

        async function fetchUserAccounts(){
            try {
                const response = await  getAllAccounts(1,50,{firstName: context?.user?.firstName, lastName: context?.user?.lastName})
                setUserAccounts(response.items);
                // console.log("AAA ",response.items.length)
            } catch (error) {
                console.error("❌ Error while fetching user accounts:", error);
                showErrorToast({ error, defaultMessage: "User accounts fecthing failed" });
            }
        }
        fetchUserAccounts();
        fetchTransactionCodes();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const senderAccountId = values.bankAccount
            const receiverAccountId = values.recipientAccount
            console.log(senderAccountId)
            console.log(receiverAccountId)

            const response = await getAccountById(senderAccountId);
            if(response.status!==200){
                throw new Error("Invalid Sender Account");
            }
            const senderAccount = response.data
            const senderAccountCurrencyId = senderAccount.currency.id
            const response2 = await getAccountById(receiverAccountId);
            if(response2.status!=200){
                throw new Error("Invalid Receiver Account");
            }
            const receiverAccount = response2.data
            const receiverAccountCurrencyId = receiverAccount.currency.id
            const receiverAccountNumber = receiverAccount.accountNumber

            const transactionData = {
                fromAccountId: senderAccountId,
                fromCurrencyId: senderAccountCurrencyId,
                toAccountNumber: receiverAccountNumber,
                toCurrencyId: receiverAccountCurrencyId,
                amount: values.amount,
                codeId: values.transactionCode,
                referenceNumber: values.referenceNumber,
                purpose: values.purpose,
            };

            console.log("Data sent to backend: ", transactionData)
            await createTransaction(transactionData);   //Ovaj deo ne radi za sad zato sto je na backendu ogranicenje da ToAccountNumber mora imati 18 cifara
            // kada se to na backendu popravi ovo ce raditi bez problema
            showSuccessToast({ description: "Transaction created successfully!" });

            form.reset();

        } catch (error) {
            showErrorToast({ error, defaultMessage: "Transaction failed" });
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-card shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Money transfer</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* My account */}
                    <FormField
                        control={form.control}
                        name="bankAccount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>My account</FormLabel>
                                <FormControl>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userAccounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.accountNumber}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Receiver account */}
                    <FormField
                        control={form.control}
                        name="recipientAccount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>My account</FormLabel>
                                <FormControl>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userAccounts
                                                .filter((account) => account.id !== form.watch("bankAccount"))
                                                .map((account) => (
                                                    <SelectItem key={account.id} value={account.id}>
                                                        {account.accountNumber}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Transaction code */}
                    <FormField
                        control={form.control}
                        name="transactionCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction code</FormLabel>
                                <FormControl>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transactionCodes.map((code) => (
                                                <SelectItem key={code.id} value={code.id}>
                                                    {code.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Reference number */}
                    <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference number</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Purpose */}
                    <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purpose</FormLabel>
                                <FormControl>
                                    <Input placeholder="Purpose" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">Send</Button>
                </form>
            </Form>
        </div>
    );
}
