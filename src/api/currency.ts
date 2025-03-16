import api from "./axios"

export const getAllCurrencies = async () => {
    try {
        const response = await api.get("/currencies");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching currencies:", error);
        throw error;
    }
}

export const getExchangeRate = async (currencyFromCode: string, currencyToCode: string) => {
    try {
        // Slanje POST zahteva sa podacima u telu
        const response = await api.request({
            method: "post", // Metod zahteva
            url: "/exchanges/currencies", // URL endpoint-a
            data: { // Telo zahteva koje šaljemo
                CurrencyFromCode: currencyFromCode, // Slanje valute iz koje se konvertuje
                CurrencyToCode: currencyToCode // Slanje valute u koju se konvertuje
            },
            headers: {
                "Accept": "application/json", // Očekujemo JSON odgovor
                "Content-Type": "application/json" // Tip podataka koji šaljemo
            }
        });

        return response.data; // Vraća odgovor iz backend-a
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        throw error;
    }
};





