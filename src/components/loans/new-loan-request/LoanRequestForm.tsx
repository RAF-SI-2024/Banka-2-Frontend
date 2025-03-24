import {
    Form,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { loanFormSchema } from "@/components/loans/new-loan-request/LoanRequestFormDef.tsx";
import * as React from "react";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Card, CardContent } from "../../ui/card.tsx";
import LoanRequestLoanDetails from "@/components/loans/new-loan-request/LoanRequestLoanDetails.tsx";
import LoanRequestPersonalInfo from "@/components/loans/new-loan-request/LoanRequestPersonalInfo.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import LoanRequestFinancialInformation from "@/components/loans/new-loan-request/LoanRequestFinancialInformation.tsx";
import {getAllAccountsClient} from "@/api/bank-account.ts";
import {BankAccount} from "@/types/bank-account.ts";
import {createLoan, getAllLoanTypes} from "@/api/loan.ts";
import {LoanType} from "@/types/loan-type.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {LoanCreateRequest} from "@/types/loan.ts";
import {InterestType} from "@/types/loan.ts";
import {useNavigate} from "react-router-dom";



export function LoanRequestForm() {
    const form = useForm<z.infer<typeof loanFormSchema>>({
        resolver: zodResolver(loanFormSchema),
        mode: "onChange",
        defaultValues: {
            amount: 100000,
            monthlySalary: 0,
            interestRateType: InterestType.Fixed.toString(),
            employmentPeriod: "0 months",
            phoneNumber: JSON.parse(sessionStorage.user).phoneNumber
        },
    });

    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const navigate = useNavigate();

    async function onSubmit(values: z.infer<typeof loanFormSchema>) {
        // Find the bank account with the matching accountId
        const selectedAccount = bankAccounts.find((account) => account.id === values.accountId);
        console.log("AA")
        // If an account is found, proceed to build the payload
        if (selectedAccount) {
            const payload: LoanCreateRequest = {
                typeId: values.loanType,
                accountId: values.accountId,
                amount: values.amount,
                interestType: Number(values.interestRateType),
                period: Number(values.numInstallments),
                currencyId: selectedAccount.currency.id,  // Get the currency ID from the selected account
            };

            console.log(payload);

            try {
                const data = await createLoan(payload);

                navigate("/loan/overview");
                console.log(data);

            } catch (error) {
                console.error("Error creating loan:", error);
                showErrorToast({ error, defaultMessage: "Error creating loan."});
            }
        } else {
            console.error("Account not found");
            showErrorToast({ defaultMessage: "Account not found"});
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const bankAccountsResponse = await getAllAccountsClient(JSON.parse(sessionStorage.user).id, 1, 100);
                const loanTypes = await(getAllLoanTypes(1, 100));

                if (bankAccountsResponse.status !== 200)
                    throw new Error("Failed to fetch bank accounts");


                setBankAccounts(bankAccountsResponse.data.items)
                setLoanTypes(loanTypes.items)

            } catch (error) {
                console.error("❌ Error fetching data:", error);
                showErrorToast({error, defaultMessage: "Error fetching data"})
            }
        };

        fetchData();
    }, []); // No dependencies to avoid unnecessary re-renders


    return (
        <Card className={cn("bg-transparent shadow-none border-0 lg:w-2/3 md:w-full sm:w-full")}>
            <CardContent className="mt-4 font-paragraph">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-8">
                            <LoanRequestLoanDetails loanTypes={loanTypes} />
                            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                            <LoanRequestFinancialInformation bankAccounts={bankAccounts}/>
                            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                            <LoanRequestPersonalInfo />
                        </div>

                        <div className="w-full pt-12 pb-24 ">
                         <Button variant="gradient" className="w-fit" size="lg" type="submit">Send request</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
