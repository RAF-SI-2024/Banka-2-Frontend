import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {newTransferFormSchema} from "@/components/payments/transfer-new/NewTransfertFormDef.tsx";
import {useEffect, useState} from "react";
import {getAccountById, getAllAccountsClient} from "@/api/bank-account.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";
import {BankAccount} from "@/types/bank-account.ts";
import {z} from "zod";
import {CreateTransactionRequest} from "@/types/transaction.ts";
import {createTransaction} from "@/api/transaction.ts";
import {cn} from "@/lib/utils.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {RecipientInput} from "@/components/payments/payment-new/RecipientInput.tsx";
import * as React from "react";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {fetchPaymentCodes, RawPaymentCode} from "@/api/transactionCode.ts";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import AddRecipientTemplate from "@/components/payments/payment-new/AddRecipientTemplate.tsx";

export default function NewTransferForm() {
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(newTransferFormSchema),
        defaultValues: {
            amount: 0,
            purpose: "",
        },
    });

    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [paymentCodes, setPaymentCodes] = useState<RawPaymentCode[]>([]);
    const [fromBankAccount, setFromBankAccount] = useState<BankAccount | null>(null);
    const [toBankAccount, setToBankAccount] = useState<BankAccount | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [step, setStep] = useState<"form" | "success">("form");
    const navigate = useNavigate();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const bankAccountsResponse = await getAllAccountsClient(JSON.parse(sessionStorage.user).id, 1, 100);
                const codes = await fetchPaymentCodes();

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");

                setBankAccounts(bankAccountsResponse.data.items);
                setPaymentCodes(codes);


            } catch (err) {
                showErrorToast({error: err, defaultMessage: "Failed to fetch data."})
            }
        };

        fetchData();

    }, []);


    async function onSubmit(values: z.infer<typeof newTransferFormSchema>) {
        try {

            const matchingCode = paymentCodes.find((c) => c.code ===  "289");

            if (!(fromBankAccount && toBankAccount && matchingCode)){
                throw new Error("Error fetching data.");
            }

            const transactionData = {
                fromAccountId: values.fromAccountId,
                fromCurrencyId: fromBankAccount.currency.id,
                toAccountNumber: values.toAccountNumber,
                toCurrencyId: toBankAccount.currency.id,
                amount: Number(values.amount.toString().replace(",", ".")),
                codeId: matchingCode.id,
                purpose: values.purpose,
                referenceNumber: "2025-2025"
            };


            await createTransaction(transactionData);

            setStep("success");


        } catch (error) {
            showErrorToast({ error, defaultMessage: "Transfer failed" });
        }
    }


    return (
        <Card className={cn("bg-transparent shadow-none border-0 lg:w-2/3 md:w-full sm:w-full w-full")}>
            <CardContent className="mt-8 font-paragraph">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-8 md:flex-row md:gap-4 items-baseline">
                            <FormField
                                key="fromAccountId"
                                name="fromAccountId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Transfer from</FormLabel>
                                        <FormControl>
                                            <Select {...field} value={fromBankAccount?.id || ""}
                                                    onValueChange={(value) => {
                                                        const account = bankAccounts.find(acc => acc.id === value) || null;
                                                        setFromBankAccount(account);

                                                        field.onChange(value);
                                                        if (account && account?.availableBalance < amount)
                                                            setAmountError("Amount exceeds available balance.");
                                                        else
                                                            setAmountError(null);
                                                    }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a bank account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bankAccounts.map((bankAccount) => (
                                                        bankAccount != toBankAccount ?
                                                        <SelectItem key={bankAccount.id} value={bankAccount.id}>
                                                            {bankAccount.accountNumber} {"(" + bankAccount.currency.code + ")"}
                                                        </SelectItem>: null
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            From account
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:pt-6 md:mb-auto md:w-fit sm:w-full sm:flex sm:justify-center justify-center w-full flex">
                                <span className=" md:icon-[ph--arrow-right] sm:icon-[ph--arrow-down] icon-[ph--arrow-down] md:size-8 sm:size-8 size-8"></span>
                            </div>

                            <FormField
                                key="toAccountNumber"
                                name="toAccountNumber"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Transfer to</FormLabel>
                                        <FormControl>
                                            <Select {...field} value={toBankAccount?.accountNumber.toString() || ""}
                                                    onValueChange={(value) => {
                                                        const account = bankAccounts.find(acc => acc.accountNumber.toString() === value) || null;
                                                        setToBankAccount(account);

                                                        field.onChange(value);
                                                    }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a bank account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bankAccounts.map((bankAccount) => (
                                                        bankAccount != fromBankAccount ?
                                                            <SelectItem key={bankAccount.accountNumber.toString()} value={bankAccount.accountNumber.toString()}>
                                                                {bankAccount.accountNumber} {"(" + bankAccount.currency.code + ")"}
                                                            </SelectItem>: null
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            To account
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            key="amount"
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-8">
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            currency={fromBankAccount?.currency?.code || "RSD"}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                const newAmount = parseFloat(event.target.value.replace(/\./g, "").replace(",", "."));
                                                if (fromBankAccount && newAmount > fromBankAccount.availableBalance) {
                                                    setAmountError("Amount exceeds available balance.");
                                                } else {
                                                    setAmountError(null);
                                                }
                                                setAmount(newAmount);
                                            }}
                                            min={0}
                                            max={fromBankAccount?.availableBalance}
                                            defaultValue={0}

                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {fromBankAccount ? "Balance after transaction: " +
                                            formatCurrency(fromBankAccount?.availableBalance - amount, fromBankAccount?.currency?.code || "RSD") :
                                            "Transaction amount"
                                        }
                                    </FormDescription>
                                    <FormMessage>{amountError || null}</FormMessage>
                                </FormItem>

                            )}
                        />

                        <FormField
                            key="purpose"
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter the purpose of the transaction"
                                        />

                                    </FormControl>
                                    <FormDescription>Let us know the purpose of transaction? (e.g., family support, education)</FormDescription>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <div className="w-full pt-8 pb-24 ">
                            <Button variant="gradient" className="w-fit" size="lg" type="submit">Complete transfer</Button>
                        </div>

                        <Dialog open={step === "success"}
                                onOpenChange={(open) => {
                                    !open; setStep("form");
                                    if(fromBankAccount)
                                        navigate(`/bank-account/${fromBankAccount.id}`);
                                }}>
                            <DialogContent className="min-w-fit">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>
                                    </DialogDescription>
                                </DialogHeader>
                                <AddRecipientTemplate
                                    homeNavigate={() => navigate("/home")}
                                />
                            </DialogContent>
                        </Dialog>


                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}