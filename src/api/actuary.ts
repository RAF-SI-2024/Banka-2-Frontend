import { Actuary } from "@/types/actuary.ts";
import api from "@/api/axios.ts";
import { API_BASE } from "@/constants/endpoints.ts";

// Mock podaci za actuary
// api/actuary.ts or wherever you want to store mock data
export const mockActuariesData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    actuaryType: "supervisor",
    needsApproval: false,
    limit: 500,
    usedLimit: 300,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    actuaryType: "agent",
    needsApproval: true,
    limit: 400,
    usedLimit: 100,
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    actuaryType: "supervisor",
    needsApproval: false,
    limit: 500,
    usedLimit: 300,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    actuaryType: "agent",
    needsApproval: true,
    limit: 400,
    usedLimit: 100,
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    actuaryType: "supervisor",
    needsApproval: false,
    limit: 500,
    usedLimit: 300,
  },
  {
    id: 2,
    firstName: "eeeeee",
    lastName: "Smith",
    email: "jane.smith@example.com",
    actuaryType: "agent",
    needsApproval: true,
    limit: 400,
    usedLimit: 100,
  },
  {
    id: 1,
    firstName: "aaaaaaaaa",
    lastName: "Doe",
    email: "john.doe@example.com",
    actuaryType: "supervisor",
    needsApproval: false,
    limit: 500,
    usedLimit: 300,
  },

  // Add more mock actuary objects here as needed
];

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
