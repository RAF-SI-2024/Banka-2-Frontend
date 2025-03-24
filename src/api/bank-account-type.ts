import api from "@/api/axios.ts";

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