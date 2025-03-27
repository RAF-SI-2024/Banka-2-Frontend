import { Actuary } from "@/types/actuary.ts";
import api from "@/api/axios.ts";
import { API_BASE } from "@/constants/endpoints.ts";

//todo kad budu gotove rute

/*
export const getActuaryByEmployeeId = async (
  employeeId: string
): Promise<Actuary> => {
  try {
    const response = await api.get<Actuary>(
      `${API_BASE}/actuary/employee/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch actuary data:", error);
    throw error;
  }
};
*/
