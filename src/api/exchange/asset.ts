import {api_bank_user, api_exchange} from "@/api/axios.ts";
import {AssetResponse} from "@/types/exchange/asset.ts";


export const getAllAssets = async (
    page: number,
    size: number,
): Promise<AssetResponse> => {
    try {
        const response = await api_exchange.get("/assets", {
            params: {
                page,
                size,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching assets:", error);
        throw error;
    }
}


