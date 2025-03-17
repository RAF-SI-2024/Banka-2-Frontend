import api from "./axios";
import { API_BASE } from "../constants/endpoints";


export const getAllLoans = async () => {
    try {
        const response = await api.get("/loans");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching loans:", error);
        throw error;
    }
}