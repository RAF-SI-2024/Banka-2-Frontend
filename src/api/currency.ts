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