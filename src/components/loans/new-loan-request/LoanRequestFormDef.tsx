import * as z from "zod";

export const loanFormSchema = z.object({
    loanType: z.string(),
    interestRateType: z.string(),
    amount: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                // Convert "231.323,00" -> 231323.00
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(1000, "Amount is too small")
            .max(500000000, "Amount is too big")
    ),
    purpose: z.string(),
    monthlySalary: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                // Convert "231.323,00" -> 231323.00
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number().min(0)
    ),
    employmentStatus: z.string(),
    employmentPeriod: z.string(),
    numInstallments: z.string(),
    phoneNumber: z.string()
        .min(12, "Phone number does not have enough digits")
        .max(13, "Phone number has more than 13 digits")
        .regex(
            /^\+\d{11,12}$/,
            "Phone number must start with + followed by 11-12 digits"
        ),
    accountId: z.string(),
});


// Vrstu kredita (gotovinski, stambeni, auto, refinansirajuci, studentski)
// Tip kamatne stope (fiksni, varijabilni)
// Iznos kredita i valuta
// Svrha kredita
// Iznos mesečne plate
// Status zaposlenja (stalno, privremeno, nezaposlen)
// Period zaposlenja kod trenutnog poslodavca
// Rok otplate u ratama tj. mesecima:
// Gotovinski, auto, studentski, refinansirajući: 12, 24, 36, 48, 60, 72, 84
// Stambeni: 60, 120, 180, 240, 300, 360
// Kontakt telefon
// Broj računa - bira iz drop down menija, valuta računa mora da se poklapa sa valutom kredita