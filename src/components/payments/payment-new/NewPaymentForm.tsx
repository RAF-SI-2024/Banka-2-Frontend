import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {paymentSchema} from "@/components/payments/payment-new/NewPaymentFormDef.tsx";
import {useEffect, useState} from "react";
import {
    fetchPaymentCodes,
    fetchRecipientCurrencyCode,
    RawPaymentCode
} from "@/api/transactionCode.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";
import VerificationOTP from "@/components/__common__/VerificationOTP.tsx";
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
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {z} from "zod";
import * as React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {BankAccount} from "@/types/bank-account.ts";
import {getAllAccountsClient} from "@/api/bank-account.ts";
import {Input} from "@/components/ui/input.tsx";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Template} from "@/types/template.ts";
import {getTemplates} from "@/api/template.ts";
import {RecipientInput} from "@/components/payments/payment-new/RecipientInput.tsx";
import {CreateTransactionRequest} from "@/types/transaction.ts";
import {createTransaction} from "@/api/transaction.ts";
import {Button} from "@/components/ui/button.tsx";
import AddRecipientTemplate from "@/components/payments/payment-new/AddRecipientTemplate.tsx";
import {useLocation, useNavigate} from "react-router-dom";

export default function NewPaymentForm() {
    const location = useLocation();
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentCode: "289",
            recipientAccount: "",
            accountId: "",
            purpose: "",
            referenceNumber: "",
            amount: 0,
        },
        mode: "onChange"
    });

    const [paymentCodes, setPaymentCodes] = useState<RawPaymentCode[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [step, setStep] = useState<"form" | "otp" | "success">("form");
    const navigate = useNavigate();




    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const codes = await fetchPaymentCodes();
                const bankAccountsResponse = await getAllAccountsClient(JSON.parse(sessionStorage.user).id, 1, 100);
                const templatesResponse = await getTemplates();

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");

                setPaymentCodes(codes);
                setTemplates(templatesResponse.items);
                setBankAccounts(bankAccountsResponse.data.items);
                let defaultBankAccount = null;
                if (location.state && location.state.accountId) {
                    defaultBankAccount = bankAccountsResponse.data.items.find(
                        (f: BankAccount) => f.id === location.state.accountId
                    );

                    if (defaultBankAccount) {
                        setSelectedBankAccount(defaultBankAccount);
                        form.setValue("accountId", defaultBankAccount.id, { shouldValidate: true });
                    }
                }


            } catch (err) {
                showErrorToast({error: err, defaultMessage: "Failed to fetch data."})
            }
        };

        fetchData();

    }, []);



    async function onSubmit (values: z.infer<typeof paymentSchema>) {
        try {
            const toAcc = values.recipientAccount//FIXME: OVDE SE SALJE SVE A NE SAMO 9 CIFARA
            const matchingCode = paymentCodes.find((c) => c.code === values.paymentCode || c.code === "289");
            const toCurrencyId = await fetchRecipientCurrencyCode(toAcc);
            console.log(matchingCode);
            console.log(toCurrencyId);
            if (!(selectedBankAccount && toCurrencyId && matchingCode)){
                throw new Error("Errorrrr");
            }


            const payload: CreateTransactionRequest = {
                fromAccountId: values.accountId,
                fromCurrencyId: selectedBankAccount.currency.id,
                toAccountNumber: values.recipientAccount,
                toCurrencyId: toCurrencyId,
                amount: values.amount,
                codeId: matchingCode.id,
                referenceNumber: values.referenceNumber,
                purpose: values.purpose
            }

            console.log("SLANJE TRANSKACIJE", payload);

            const response = await createTransaction(payload);

            showSuccessToast({description: "Transaction successful!"});

            setStep("success")
        }
        catch(error){
            showErrorToast({error, defaultMessage: "Failed to make transaction."})
        }

    }

    async function onSendPaymentClick(){

        const isValid = await form.trigger([
            "recipientAccount",
            "amount",
            "referenceNumber",
            "purpose",
            "accountId",
            "paymentCode"
        ])

        if(isValid)
            setStep("otp");
    }




    return (
        <Card className={cn("bg-transparent shadow-none border-0 lg:w-2/3 md:w-full sm:w-full w-full")}>
            <CardContent className="mt-8 font-paragraph">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                        <div className="flex flex-col gap-8 md:flex-row md:gap-4 items-baseline">
                            <FormField
                                key="accountId"
                                name="accountId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Your bank account</FormLabel>
                                        <FormControl>
                                            <Select {...field} value={selectedBankAccount?.id || ""}
                                                    onValueChange={(value) => {
                                                        const account = bankAccounts.find(acc => acc.id === value) || null;
                                                        setSelectedBankAccount(account);

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
                                                        <SelectItem key={bankAccount.id} value={bankAccount.id}>
                                                            {bankAccount.accountNumber} {"(" + bankAccount.currency.code + ")"}
                                                        </SelectItem>
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

                            <RecipientInput templates={templates} />
                        </div>

                        <FormField
                            key="amount"
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-8">
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            currency={selectedBankAccount?.currency?.code || "RSD"}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                const newAmount = parseFloat(event.target.value.replace(/\./g, "").replace(",", "."));
                                                if (selectedBankAccount && newAmount > selectedBankAccount.availableBalance) {
                                                    setAmountError("Amount exceeds available balance.");
                                                } else {
                                                    setAmountError(null);
                                                }
                                                setAmount(newAmount);
                                            }}
                                            min={0}
                                            max={selectedBankAccount?.availableBalance}
                                            defaultValue={0}

                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {selectedBankAccount ? "Balance after transaction: " +
                                            formatCurrency(selectedBankAccount?.availableBalance - amount, selectedBankAccount?.currency?.code || "RSD") :
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

                        <FormField
                            key="referenceNumber"
                            name="referenceNumber"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-8">
                                    <FormLabel>Reference Number (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="97-1234567890123"
                                            maxLength={20}
                                            {...field}
                                            className="pr-10"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction identifier
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            key="paymentCode"
                            name="paymentCode"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-8">

                                    <div className="flex items-center">
                                        <FormLabel>Payment code</FormLabel>

                                        <Button type="button" variant="link" size="tight" className="pl-2"  onClick={() => window.open("https://www.erstebank.rs/en/private-clients/e-banking/netbanking/payment-base-code-register")}>
                                            <span className="icon-[ph--question] size-4" />
                                        </Button>

                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="289"
                                            maxLength={3}
                                            {...field}
                                            className="pr-10"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Three digit number in format 2XX
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Dialog open={step === "otp"} onOpenChange={(open) => {!open; setStep("form") }}>
                            <DialogContent className="min-w-fit">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>
                                    </DialogDescription>
                                </DialogHeader>
                                <VerificationOTP form={form} nextStep={form.handleSubmit(onSubmit)} />
                            </DialogContent>
                        </Dialog>

                        <Dialog open={step === "success"}
                                onOpenChange={(open) => {
                                    !open; setStep("form");
                                    if(selectedBankAccount)
                                        navigate(`/bank-account/${selectedBankAccount.id}`);
                        }}>
                            <DialogContent className="min-w-fit">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>
                                    </DialogDescription>
                                </DialogHeader>
                            <AddRecipientTemplate
                                homeNavigate={() => navigate("/home")}
                                recipientAccount={form.getValues().recipientAccount}
                                existingRecipients={templates.map((a) => a.accountNumber)}
                            />
                            </DialogContent>
                        </Dialog>


                        <div className="w-full pt-8 pb-24 ">
                            <Button variant="gradient" className="w-fit" size="lg" type="button" onClick={onSendPaymentClick}>Send payment</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>);

}