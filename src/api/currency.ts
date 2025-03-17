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

// U SLUCAJU DA SE SALJE POST ZAHTEV SA BODY
// export const getExchangeRate = async (currencyFromCode: string, currencyToCode: string) => {
//     try {
//
//         const response = await api.request({
//             method: "post", // Metod zahteva
//             url: "/exchanges/currencies",
//             data: {
//                 currencyFromCode: currencyFromCode,
//                 currencyToCode: currencyToCode
//             },
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json"
//             }
//         });
//
//         return response.data;
//     } catch (error) {
//         console.error("Failed to fetch exchange rate:", error);
//         throw error;
//     }
// };

// U SLUCAJU DA SE SALJE GET ZAHTEV SA PARAMETRIMA
export const getExchangeRate = async (currencyFromCode: string, currencyToCode: string) => {
    try {
        const response = await api.get("/exchanges/currencies", {
            params: {
                currencyFromCode: currencyFromCode,
                currencyToCode: currencyToCode
            },
            headers: {
                "Accept": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        throw error;
    }
};

// Primer zahteva: GET http://localhost:5075/api/v1/exchanges/currencies?currencyFromCode=RSD&currencyToCode=EUR
