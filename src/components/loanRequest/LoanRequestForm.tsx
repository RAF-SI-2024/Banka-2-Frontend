import {
    Form,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { loanFormSchema } from "@/components/loanRequest/LoanRequestFormFieldsDef.tsx";
import * as React from "react";
import {useEffect, useState} from "react";
import { getAllCurrencies } from "@/api/currency.ts";
import {cn} from "@/lib/utils.ts";
import {Card, CardContent } from "../ui/card";
import LoanRequestLoanDetails from "@/components/loanRequest/LoanRequestLoanDetails.tsx";
import LoanRequestPersonalInfo from "@/components/loanRequest/LoanRequestPersonalInfo.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import LoanRequestFinancialInformation from "@/components/loanRequest/LoanRequestFinancialInformation.tsx";
import {getAllAccountsClient} from "@/api/bankAccount.ts";
import {BankAccount} from "@/types/bankAccount.ts";

async function onSubmit(values: z.infer<typeof loanFormSchema>) {
    console.log(values);
}

export function LoanRequestForm() {
    const form = useForm<z.infer<typeof loanFormSchema>>({
        resolver: zodResolver(loanFormSchema),
        mode: "onChange",
        defaultValues: {
            amount: 100000,
            monthlySalary: 0
        },
    });

    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const currenciesResponse = await getAllCurrencies();
                console.log("Currencies:", currenciesResponse);
                const bankAccountsResponse = await getAllAccountsClient(JSON.parse(sessionStorage.user).id, 1, 100);

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");

                setBankAccounts(bankAccountsResponse.data.items)

            } catch (error) {
                console.error("❌ Error fetching currencies:", error);
            }
        };

        fetchData();
    }, []); // No dependencies to avoid unnecessary re-renders


    return (
        <Card className={cn("bg-transparent shadow-none border-0 lg:w-2/3 md:w-full sm:w-full")}>
            <CardContent className="mt-4 font-paragraph">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-8">
                            <LoanRequestLoanDetails />
                            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                            <LoanRequestFinancialInformation bankAccounts={bankAccounts}/>
                            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                            <LoanRequestPersonalInfo />
                        </div>

                        <div className="w-full pt-12 pb-32 ">
                         <Button variant="gradient" className="w-fit" size="lg" type="submit">Send request</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
