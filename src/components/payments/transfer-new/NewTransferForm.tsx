import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {newTransferFormSchema} from "@/components/payments/transfer-new/NewTransfertFormDef.tsx";
import { useEffect, useState} from "react";
import {getAllAccountsClient} from "@/api/bank_user/bank-account.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import {z} from "zod";
import {createTransaction} from "@/api/bank_user/transaction.ts";
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
import * as React from "react";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {fetchPaymentCodes, RawPaymentCode} from "@/api/bank_user/transactionCode.ts";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import AddRecipientTemplate from "@/components/payments/payment-new/AddRecipientTemplate.tsx";
import {Currency} from "@/types/bank_user/currency.ts";


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
    const [fromBankAccounts, setFromBankAccounts] = useState<BankAccount[]>([]);
    const [toBankAccounts, setToBankAccounts] = useState<BankAccount[]>([])
    const [paymentCodes, setPaymentCodes] = useState<RawPaymentCode[]>([]);
    const [fromBankAccount, setFromBankAccount] = useState<BankAccount | null>(null);
    const [toBankAccount, setToBankAccount] = useState<BankAccount | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [toCurrency, setToCurrency] = useState<Currency | null>(null);
    const [toCurrencies, setToCurrencies] = useState<Currency[]>([])
    const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
    const [fromCurrencies, setFromCurrencies] = useState<Currency[]>([]);
    const [step, setStep] = useState<"form" | "success">("form");
    const navigate = useNavigate();

    const [rotation, setRotation] = useState(0);

    const [swap, setSwap] = useState(false);

    const handleSwapClick = () => {
        setRotation((prev) => prev + 180);

        const tmpFromAccount = fromBankAccount;
        const tmpToAccount = toBankAccount;
        const tmpFromCurrency = fromCurrency;
        const tmpToCurrency = toCurrency;
        const tmpFromCurrencies = [...fromCurrencies];
        const tmpToCurrencies = [...toCurrencies];


        setFromCurrency(tmpToCurrency);
        setToCurrency(tmpFromCurrency);
        setFromCurrencies(tmpToCurrencies);
        setToCurrencies(tmpFromCurrencies);




        setFromBankAccounts(bankAccounts.filter(acc => acc !== tmpFromAccount || acc.accountCurrencies.length > 0))
        setToBankAccounts(bankAccounts.filter(acc => acc !== tmpToAccount || acc.accountCurrencies.length > 0))

        setSwap(!swap);

        // Update state with swapped values
    };

    useEffect(() => {
        setFromBankAccounts(bankAccounts.filter(acc => acc !== toBankAccount || acc.accountCurrencies.length > 0))
        setToBankAccounts(bankAccounts.filter(acc => acc !== fromBankAccount || acc.accountCurrencies.length > 0))
    }, [fromBankAccount, toBankAccount]);

    useEffect(() => {
        const tmpFromAccount = fromBankAccount;
        const tmpToAccount = toBankAccount;

        setFromBankAccount(tmpToAccount);
        setToBankAccount(tmpFromAccount);

        if (tmpToAccount) {
            form.setValue("fromAccountNumber", tmpToAccount.accountNumber.toString());
        }
        if (tmpFromAccount) {
            form.setValue("toAccountNumber", tmpFromAccount.accountNumber.toString());
        }
    }, [swap]);

    function generateAccountSelectContent(dir=true){
        let relevantAccounts = dir ? fromBankAccounts : toBankAccounts;
        return (
            <SelectContent>
                {relevantAccounts.map((bankAccount) => (
                    <SelectItem key={bankAccount.accountNumber.toString()} value={bankAccount.accountNumber.toString()}>
                        {bankAccount.accountNumber} {"(" + bankAccount.currency.code + ")"}
                    </SelectItem>
                ))}
            </SelectContent>);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bankAccountsResponse = await getAllAccountsClient(JSON.parse(sessionStorage.user).id, 1, 100);
                const codes = await fetchPaymentCodes();

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");

                setBankAccounts(bankAccountsResponse.data.items);
                setPaymentCodes(codes);
                setFromBankAccounts(bankAccountsResponse.data.items);
                setToBankAccounts(bankAccountsResponse.data.items);
            } catch (err) {
                showErrorToast({error: err, defaultMessage: "Failed to fetch data."})
            }
        };

        fetchData();
    }, []);

    async function onSubmit(values: z.infer<typeof newTransferFormSchema>) {
        try {
            const matchingCode = paymentCodes.find((c) => c.code ===  "289");

            if (!(fromBankAccount && toBankAccount && matchingCode && fromCurrency && toCurrency)){
                throw new Error("Error fetching data.");
            }

            console.log(fromCurrency.code);
            const transactionData = {
                fromAccountNumber: values.fromAccountNumber,
                fromCurrencyId: fromCurrency.id,
                toAccountNumber: values.toAccountNumber,
                toCurrencyId: toCurrency.id,
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
                                                        <SelectValue>{fromCurrency?.code}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fromCurrencies.map((item) =>
                                                            item !== toCurrency || fromBankAccount !== toBankAccount ? (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    {item.code}
                                                                </SelectItem>
                                                            ) : null
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    key="fromAccountNumber"
                                    name="fromAccountNumber"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Transfer from</FormLabel>
                                            <FormControl>
                                                <Select {...field} value={fromBankAccount?.accountNumber.toString() || ""}
                                                        onValueChange={(value) => {
                                                            const account = bankAccounts.find(acc => acc.accountNumber.toString() === value) || null;
                                                            setFromBankAccount(account);

                                                            field.onChange(value);

                                                            if(account) {
                                                                setFromCurrency(account.currency);
                                                                setFromCurrencies([account.currency, ...account.accountCurrencies.map(ac => ac.currency)]);
                                                                form.setValue("fromCurrencyId", account.currency.id);
                                                            }

                                                            if (account && fromCurrency && amount > 0) {
                                                                const availableBalance = fromCurrency === account.currency
                                                                    ? account.availableBalance
                                                                    : account.accountCurrencies.find(ac => ac.currency === fromCurrency)?.availableBalance || 0;

                                                                if (amount > availableBalance) {
                                                                    setAmountError("Amount exceeds available balance.");
                                                                } else {
                                                                    setAmountError(null);
                                                                }
                                                            }
                                                        }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a bank account" />
                                                    </SelectTrigger>
                                                    {generateAccountSelectContent(true)}
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
                                <Button type="button" size={"icon"} variant="link" onClick={handleSwapClick}>
                                    <span
                                        className="icon-[ph--arrows-clockwise-bold] transition-transform duration-500 text-xl antialiased"
                                        style={{ transform: `rotate(${rotation}deg)` }}
                                    />
                                </Button>
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
                                                        const selected = toCurrencies.find(c => c.id === val);
                                                        if (selected) setToCurrency(selected);
                                                    }} >
                                                    <SelectTrigger>
                                                        <SelectValue>{toCurrency?.code || "RSD"}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {toCurrencies.map((item) =>
                                                            item !== fromCurrency || fromBankAccount !== toBankAccount ? (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    {item.code}
                                                                </SelectItem>
                                                            ) : null
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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

                                                            if(account) {
                                                                setToCurrency(account.currency);
                                                                setToCurrencies([account.currency, ...account.accountCurrencies.map(ac => ac.currency)]);
                                                                form.setValue("toCurrencyId", account.currency.id);
                                                            }
                                                        }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a bank account" />
                                                    </SelectTrigger>
                                                    {generateAccountSelectContent(false)}
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
                                                    fromBankAccount &&
                                                    fromCurrency &&
                                                    newAmount > (
                                                        fromCurrency === fromBankAccount.currency
                                                            ? fromBankAccount.availableBalance
                                                            : fromBankAccount.accountCurrencies.find(ac => ac.currency === fromCurrency)?.availableBalance || 0
                                                    )
                                                ) {
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
                                            formatCurrency( fromCurrency === fromBankAccount.currency
                                                ? fromBankAccount.availableBalance - amount
                                                : (fromBankAccount.accountCurrencies.find(ac => ac.currency === fromCurrency)?.availableBalance || 0) - amount, fromCurrency?.code || "RSD") :
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