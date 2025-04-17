import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {getLoanById} from "@/api/bank_user/loan.ts";
import {Loan} from "@/types/bank_user/loan.ts";
import {Toaster} from "@/components/ui/sonner.tsx";
import LoanDetailsClientLoanCard from "@/components/loans/loan-details/LoanDetailsClientLoan.tsx";
import InstallmentListCard from "@/components/loans/loan-details/InstallmentList.tsx";

export default function LoanDetailsClientPage(){
    const { loanId } = useParams<{ loanId: string }>()
    const [error, setError] = useState<string | null>(null);
    const [loan, setLoan] = useState<Loan>();
    const navigate = useNavigate();

    const handleAccountInfoClick = () => {
        if (loan)
            navigate(`/bank-account/${loan.account.id}`)
    }

    const getLoanInfo = async () => {
        setError(null);
        if (!loanId) {
            throw new Error("LoanId is missing from URL!")
        }
        try {
            const data = await getLoanById(loanId);

            setLoan(data);
        } catch (err) {
            showErrorToast({error: err, defaultMessage:"Failed to fetch loan info"})
            setError("Failed to fetch loan info");
        }
    };

    useEffect(() => {
        getLoanInfo();
    },[]);

    if (error || loanId==undefined) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;


    // Broj kredita
    // Vrsta kredita (gotovinski (keš), stambeni, auto, refinansirajući, studentski)
    // Ukupni iznos kredita
    // Period otplate (broj meseci/rata)
    // Nominalna kamatna stopa (početna pri kreiranju kredita)
    // Efektivna kamatna stopa (trenutna - kod varijabilne kamatne stope to je koliko bi im trenutno naplatili, tj. r = R + M)
    // Datum ugovaranja kredita
    // Datum kada kredit treba da bude isplacen
    // Iznos sledeće rate
    // Datum sledeće rate
    // Preostalo dugovanje (koliko jos treba da se otplati)
    // Valuta kredita (RSD, EUR itd.)
    //

    if (error || loan == undefined) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">{loan.type.name || "An unnamed loan"} overview</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <LoanDetailsClientLoanCard loan={loan} handleAccountInfoClick={handleAccountInfoClick} className="col-span-2"/>
                <InstallmentListCard loanId={loan.id} className="col-span-2"/>
            </div>

        </main>
    )

}