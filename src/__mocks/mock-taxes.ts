import {Tax, TaxRole} from "@/types/exchange/tax.ts";

export const mockTaxes: Tax[] = [
    {
        id:"t1",
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@gmail.com",
        role: TaxRole.Actuar,
        debt: 1000
    },
    {
        id:"t2",
        firstName: "Till",
        lastName: "Lindemann",
        email: "rammstein@gmail.com",
        role: TaxRole.Client,
        debt: 2500
    },
    {
        id:"t3",
        firstName: "James",
        lastName: "Hetfield",
        email: "metallica@gmail.com",
        role: TaxRole.Client,
        debt: 5000
    },
    {
        id:"t4",
        firstName: "Corey",
        lastName: "Taylor",
        email: "slipknot@gmail.com",
        role: TaxRole.Actuar,
        debt: 1000
    },
    {
        id:"t5",
        firstName: "Dave",
        lastName: "Mustaine",
        email: "megadeth@gmail.com",
        role: TaxRole.Actuar,
        debt: 3000
    },
];
