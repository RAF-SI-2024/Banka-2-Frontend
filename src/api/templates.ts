import api from "./axios"

export const createTransactionTemplate = async (name: string, accountNumber: string) => {
    try {
        const response = await api.post("/transactions/templates", {
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
        const response = await api.get("/transactions/templates", {
            params: { size: 50 }, // Dodaj parametar za veličinu strane
        });

        console.log("TEMPLATE FULL RESPONSE:", response.data); // Proveri šta se tačno vraća
        return response.data;
    } catch (error) {
        console.error("Greška pri učitavanju templejta:", error);
        return []; // Vraćamo prazan niz ako dođe do greške
    }
};


export const deleteTemplate = async (id: string, name: string, accountNumber: string) => {
    try {
        const response = await api.put(`/transactions/templates/${id}`, {
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
        const response = await api.put(`/transactions/templates/${id}`, {
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

