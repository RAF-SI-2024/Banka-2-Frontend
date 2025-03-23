import api from "@/api/axios.ts";

export const createCompany = async (data: any) => {
    try {
        const response = await api.post("/companies", data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ Failed to create company:", error);
        throw error;
    }
};