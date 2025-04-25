import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {paymentSchema} from "@/components/payments/payment-new/NewPaymentFormDef.tsx";
import {useEffect, useState} from "react";
import {
    fetchPaymentCodes,
    RawPaymentCode
} from "@/api/bank_user/transactionCode.ts";
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
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import {getAllAccountsClient} from "@/api/bank_user/bank-account.ts";
import {Input} from "@/components/ui/input.tsx";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Template} from "@/types/bank_user/template.ts";
import {getTemplates} from "@/api/bank_user/template.ts";
import {RecipientInput} from "@/components/payments/payment-new/RecipientInput.tsx";
import {CreateTransactionRequest} from "@/types/bank_user/transaction.ts";
import {createTransaction} from "@/api/bank_user/transaction.ts";
import {Button} from "@/components/ui/button.tsx";
import AddRecipientTemplate from "@/components/payments/payment-new/AddRecipientTemplate.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {Currency} from "@/types/bank_user/currency.ts";
import {getAllCurrencies} from "@/api/bank_user/currency.ts";

export default function NewPaymentForm() {
    const location = useLocation();
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentCode: "289",
            recipientAccount: "",
            accountNumber: "",
            purpose: "",
            fromCurrencyId: "",
            toCurrencyId: "",
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
    const [toCurrency, setToCurrency] = useState<Currency | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
    const [fromCurrencies, setFromCurrencies] = useState<Currency[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([])
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
                const currencies = await getAllCurrencies();

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");

                setPaymentCodes(codes);
                setTemplates(templatesResponse.items);
                setBankAccounts(bankAccountsResponse.data.items);
                setCurrencies(currencies);
                const rsdCurrency: Currency = currencies.find((c: Currency) => c.code === "RSD");
                setToCurrency(rsdCurrency);
                if (rsdCurrency)
                    form.setValue("toCurrencyId", rsdCurrency.id)
                let defaultBankAccount = null;
                if (location.state && location.state.accountId) {
                    defaultBankAccount = bankAccountsResponse.data.items.find(
                        (f: BankAccount) => f.id === location.state.accountId
                    );

                    if (defaultBankAccount) {
                        setSelectedBankAccount(defaultBankAccount);
                        form.setValue("accountNumber", defaultBankAccount.accountNumber, { shouldValidate: true });
                    }
                }

                if(location.state?.templateAccount){
                    form.setValue("recipientAccount", location.state.templateAccount)
                }


            } catch (err) {
                showErrorToast({error: err, defaultMessage: "Failed to fetch data."})
            }
        };

        fetchData();

    }, []);



    async function onSubmit (values: z.infer<typeof paymentSchema>) {
        try {
            const toAcc = values.recipientAccount
            const matchingCode = paymentCodes.find((c) => c.code === values.paymentCode || c.code === "289");

            console.log(matchingCode);
            if (!(selectedBankAccount && matchingCode)){
                throw new Error("Errorrrr");
            }



            const payload: CreateTransactionRequest = {
                fromAccountNumber: values.accountNumber,
                fromCurrencyId: values.fromCurrencyId,
                toAccountNumber: values.recipientAccount,
                toCurrencyId: values.toCurrencyId,
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
            console.log(error);
            showErrorToast({error, defaultMessage: "Failed to make transaction."})
        }

    }

    async function onSendPaymentClick(){

        const isValid = await form.trigger([
            "recipientAccount",
            "amount",
            "referenceNumber",
            "purpose",
            "accountNumber",
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
                            <div className="flex flex-col gap-4 w-full">
                                <FormField
                                    key="fromCurrencyId"
                                    name="fromCurrencyId"
                                    render={({ field }) => (
                                        <FormItem className="w-fit">
                                            <FormLabel>From Currency</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={fromCurrency?.id}
                                                    onValueChange={val => {
                                                        field.onChange(val);
                                                        const selected = fromCurrencies.find(c => c.id === val);
                                                        if (selected) setFromCurrency(selected);
                                                    }} >
                                                    <SelectTrigger>
                                                        <SelectValue >{fromCurrency?.code}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fromCurrencies.map((item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    key="accountNumber"
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Your bank account</FormLabel>
                                            <FormControl>
                                                <Select {...field} value={selectedBankAccount?.id || ""}
                                                        onValueChange={(value) => {
                                                            const account = bankAccounts.find(acc => acc.id === value) || null;
                                                            setSelectedBankAccount(account);

                                                            field.onChange(account?.accountNumber);

                                                            if(account) {
                                                                setFromCurrency(account.currency)

                                                                setFromCurrencies([account.currency, ...account.accountCurrencies.map(ac => ac.currency)]);
                                                            }


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

                            </div>
                            <div className="md:pt-24 md:mb-auto md:w-fit sm:w-full sm:flex sm:justify-center justify-center w-full flex">
                                <span className=" md:icon-[ph--arrow-right] sm:icon-[ph--arrow-down] icon-[ph--arrow-down] md:size-8 sm:size-8 size-8"></span>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <FormField
                                    key="toCurrencyId"
                                    name="toCurrencyId"
                                    render={({ field }) => (
                                        <FormItem className="w-fit">
                                            <FormLabel>To Currency</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={toCurrency?.id}
                                                    onValueChange={val => {
                                                        field.onChange(val);
                                                        const selected = currencies.find(c => c.id === val);
                                                        if (selected) setToCurrency(selected);
                                                    }} >
                                                    <SelectTrigger>
                                                        <SelectValue >{toCurrency?.code || "RSD"}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map((item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <RecipientInput templates={templates} />
                            </div>
                        </div>

                        <FormField
                            key="amount"
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="md:w-1/2 md:pr-8">
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <MoneyInput
                                            currency={fromCurrency?.code || "RSD"}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                const newAmount = parseFloat(event.target.value.replace(/\./g, "").replace(",", "."));
                                                if (
                                                    selectedBankAccount &&
                                                    fromCurrency &&
                                                    newAmount > (
                                                        fromCurrency === selectedBankAccount.currency
                                                            ? selectedBankAccount.availableBalance
                                                            : selectedBankAccount.accountCurrencies.find(ac => ac.currency === fromCurrency)?.availableBalance || 0
                                                    )
                                                ) {
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
                                            formatCurrency( fromCurrency === selectedBankAccount.currency
                                                ? selectedBankAccount.availableBalance - amount
                                                : (selectedBankAccount.accountCurrencies.find(ac => ac.currency === fromCurrency)?.availableBalance || 0) - amount, fromCurrency?.code || "RSD") :
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