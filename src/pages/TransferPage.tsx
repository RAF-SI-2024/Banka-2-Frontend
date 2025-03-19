import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, {useContext, useEffect, useState} from "react";
import {showErrorToast, showSuccessToast} from "@/utils/show-toast-utils.tsx";
import {getAccountById, getAllAccounts} from "@/api/bankAccount.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {createTransaction} from "@/api/transactions.ts";
import {AuthContext} from "@/context/AuthContext.tsx";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";
import {getCurrencyById} from "@/api/currency.ts";
import {BankAccount} from "@/types/bankAccount.ts";

const formSchema = z.object({
    bankAccount: z.string().min(18, "Account must have at least 18 digits"),
    recipientAccount: z.string().min(18, "Receiver account must have at least 18 digits"),
    amount: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if (val.length === 0) return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(10, "Amount is too small")
            .max(500000000, "Amount is too big")
    ),
    purpose: z.coerce.string().min(1, "Payment purpose is required."),
});

export default function TransfersPage() {
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankAccount: "",
            recipientAccount: "",
            amount: 0,
            purpose: "",
        },
    });

    const [userAccounts, setUserAccounts] = useState<BankAccount[]>([]);
    const context = useContext(AuthContext);
    const [accountCurrency, setAccountCurrency] = useState("")

    useEffect(() => {
        const accountId = form.watch("bankAccount")
        async function getCurrency(){
            try {
                const response = await getAccountById(accountId)
                const currencyId = response.data.currency.id
                const response2 = await  getCurrencyById(currencyId);
                setAccountCurrency(response2.data.code)
            } catch (error) {
                console.error("❌ Error while fetching currency for account:", error);
                showErrorToast({ error, defaultMessage: "Currency for account fecthing failed" });
            }
        }
        getCurrency()
    }, [form.watch("bankAccount")]);

    useEffect(() => {

        async function fetchUserAccounts(){
            try {
                const response = await  getAllAccounts(1,50,{firstName: context?.user?.firstName, lastName: context?.user?.lastName})
                setUserAccounts(response.items);
            } catch (error) {
                console.error("❌ Error while fetching user accounts:", error);
                showErrorToast({ error, defaultMessage: "User accounts fecthing failed" });
            }
        }
        fetchUserAccounts();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const senderAccountId = values.bankAccount
            const receiverAccountId = values.recipientAccount
            console.log(senderAccountId)
            console.log(receiverAccountId)

            const response = await getAccountById(senderAccountId);
            if(response.status!==200){
                showErrorToast({ error: new Error("Invalid Sender Account"), defaultMessage: "Invalid Sender Account" });
                return;
            }
            const senderAccount = response.data
            const senderAccountCurrencyId = senderAccount.currency.id
            const response2 = await getAccountById(receiverAccountId);
            if(response2.status!=200){
                showErrorToast({ error: new Error("Invalid Receiver Account"), defaultMessage: "Invalid Receiver Account" });
                return;
            }
            const receiverAccount = response2.data
            const receiverAccountCurrencyId = receiverAccount.currency.id
            const receiverAccountNumber = receiverAccount.accountNumber
            const transactionCode = "2b170aad-9572-498d-a92a-63cb58ea59c3"
            const referenceNumber = "2025-2025"

            const transactionData = {
                fromAccountId: senderAccountId,
                fromCurrencyId: senderAccountCurrencyId,
                toAccountNumber: receiverAccountNumber,
                toCurrencyId: receiverAccountCurrencyId,
                amount: Number(values.amount.toString().replace(",", ".")),
                codeId: transactionCode,
                referenceNumber: referenceNumber,
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
                                            {userAccounts.map((account: BankAccount) => (
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
                                                .filter((account: BankAccount) => account.id !== form.watch("bankAccount"))
                                                .map((account: BankAccount) => (
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
                                    {/*<Input type="number" placeholder="1000" {...field} />*/}
                                    <MoneyInput defaultValue={0} id={"amount"} currency={accountCurrency || "EUR"} onChange={field.onChange} min={1} max={100000}>

                                    </MoneyInput>
                                    {/*<MoneyInput*/}
                                    {/*    defaultValue={0}*/}
                                    {/*    id="amount"*/}
                                    {/*    currency={senderCurrency}*/}
                                    {/*    onChange={field.onChange}*/}
                                    {/*    min={1}*/}
                                    {/*    max={10000000}*/}
                                    {/*/>*/}
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
