import {Currency} from "@/types/currency.ts";

export const mockCurrencies: Currency[] = [
    {
        id: "81bf331a-0a35-4716-ad12-d1d1bcf66627",
        name: "US Dollar",
        code: "USD",
        symbol: "$",
        countries: [],
        description: "The official currency of the United States of America.",
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
    {
        id: "6842a5fa-eee4-4438-bcff-5217b6ac6ace",
        name: "Euro",
        code: "EUR",
        symbol: "€",
        countries: [],
        description: "The official currency of the Eurozone.",
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
    {
        id: "1a77ed84-d984-4410-85ec-ffde69508625",
        name: "Japanese Yen",
        code: "JPY",
        symbol: "¥",
        countries: [],
        description: "The official currency of Japan.",
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
    {
        id: "8e8e9283-4ced-4d9e-aa4a-1036d0174c8c",
        name: "British Pound",
        code: "GBP",
        symbol: "£",
        countries: [],
        description: "The official currency of the United Kingdom.",
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
    {
        id: "88bfe7f0-8f74-42f7-b6ba-07b3145da989",
        name: "Serbian Dinar",
        code: "RSD",
        symbol: "RSD",
        countries: [],
        description: "The official currency of Serbia.",
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    }
];

// Dodajemo reference na currency u countries
mockCurrencies[0].countries.push({
    id: "f382099b-40a7-4e29-9fe0-bcf2f500d842",
    name: "United States",
    currency: mockCurrencies[0], // USD
    createdAt: new Date(),
    modifiedAt: new Date(),
});
mockCurrencies[1].countries.push({
    id: "ca9cdcb6-db85-4f2c-bf8c-0666083cbcb6",
    name: "Germany",
    currency: mockCurrencies[1], // EUR
    createdAt: new Date(),
    modifiedAt: new Date(),
});
mockCurrencies[2].countries.push({
    id: "d718fa0b-07d4-4ff4-b7c6-a4de4cc8e72a",
    name: "Japan",
    currency: mockCurrencies[2], // JPY
    createdAt: new Date(),
    modifiedAt: new Date(),
});
mockCurrencies[3].countries.push({
    id: "c743100b-e041-4c51-8943-949e0b4bf9fd",
    name: "United Kingdom",
    currency: mockCurrencies[3], // GBP
    createdAt: new Date(),
    modifiedAt: new Date(),
});
mockCurrencies[4].countries.push({
    id: "ebc201e0-83fc-4a14-859d-e387773eb992",
    name: "Serbia",
    currency: mockCurrencies[4], // RSD
    createdAt: new Date(),
    modifiedAt: new Date(),
});