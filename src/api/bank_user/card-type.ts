import {api_bank_user} from "@/api/axios.ts";

export const getAllCardTypes = async () => {
    try {
        const response = await api_bank_user.get("/cards/types")
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching card types:", error);
        throw error;
    }
};