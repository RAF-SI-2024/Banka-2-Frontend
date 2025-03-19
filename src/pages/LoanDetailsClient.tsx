import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {getLoanById} from "@/api/loan.ts";
import {Loan} from "@/types/loan.ts";

export default function LoanDetailsClientPage(){
    const { loanId } = useParams<{ loanId: string }>()
    const [error, setError] = useState<string | null>(null);
    const [loan, setLoan] = useState<Loan>();


    const getLoanInfo = async () => {
        setError(null);
        console.log("Fetching card info");
        if (!loanId) {
            throw new Error("CardId is missing from URL!")
        }
        try {
            const data = await getLoanById(loanId);

            console.log(data);

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
    return (

        <>

        </>
    )

}