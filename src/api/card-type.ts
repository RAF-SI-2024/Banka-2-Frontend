import api from "@/api/axios.ts";

export const getAllCardTypes = async () => {
    try {
        const response = await api.get("/cards/types")
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching card types:", error);
        throw error;
    }
};