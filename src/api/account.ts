import api from "@/api/axios.ts";
import {CreateBankAccountRequest} from "@/types/bankAccount.ts";

export const fetchAccountTypes = async (page: number = 1, Size: number = 50) => {
    try {
        const response = await api.get("/accounts/types", {
            params: {
                page,      // Prosleđujemo broj stranice
                Size,  // Prosleđujemo veličinu stranice
            }
        });

        // Pretpostavljamo da server odgovara sa `items` koji je niz tipova računa
        console.log(response.data.items); // Ispisujemo podatke tipova računa
        return response.data.items || []; // Ako nema `items`, vraća prazan niz
    } catch (err) {
        console.error("Neuspelo učitavanje tipova računa.", err);
        return []; // Ako dođe do greške, vraćamo prazan niz
    }
};


export const getAllCardTypes = async () => {
    try {
        const response = await api.get("/cards/types")
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching card types:", error);
        throw error;
    }
};

export const createAccount = async (data: CreateBankAccountRequest) => {
    try {
        const response = await api.post("/accounts", data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ Failed to create account:", error);
        throw error;
    }
};

export const createCard = async (data: any) => {
    try {
        const response = await api.post("/cards", data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ Failed to create card:", error);
        throw error;
    }
};


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
