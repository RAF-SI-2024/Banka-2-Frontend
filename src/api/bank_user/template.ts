import {api_bank_user} from "../axios.ts"

export const createTransactionTemplate = async (name: string, accountNumber: string) => {
    try {
        const response = await api_bank_user.post("/transactions/templates", {
            name,
            accountNumber
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Greška pri kreiranju transakcijskog šablona:", error);
        throw error;
    }
};

export const getTemplates = async () => {
    try {
        const response = await api_bank_user.get("/transactions/templates", {
            params: { size: 50 }, // Dodaj parametar za veličinu strane
        });

        return response.data;
    } catch (error) {
        console.error("Greška pri učitavanju templejta:", error);
        return []; // Vraćamo prazan niz ako dođe do greške
    }
};


export const deleteTemplate = async (id: string, name: string, accountNumber: string) => {
    try {
        const response = await api_bank_user.put(`/transactions/templates/${id}`, {
            name,
            accountNumber,
            deleted: true, // Postavljamo deleted na true
        });

        return response.data; // Vrati ažurirani template
    } catch (error) {
        console.error("Greška pri brisanju templejta:", error);
        throw error;
    }
};

export const updateTemplate = async (id: string, name: string, accountNumber: string) => {
    try {
        const response = await api_bank_user.put(`/transactions/templates/${id}`, {
            name,
            accountNumber,
            deleted: false, // Deleted uvek mora biti false
        });

        return response.data;
    } catch (error) {
        console.error("Greška pri ažuriranju templejta:", error);
        throw error;
    }
};