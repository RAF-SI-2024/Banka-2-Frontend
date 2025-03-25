// Actuary tipovi koji definišu oblik podataka
export interface Actuary {
  id: string;
  employeeId: string;
  isAgent: boolean;
  isSupervisor: boolean;
  limit?: number; // Samo za agente
  usedLimit?: number; // Samo za agente
  needApproval?: boolean; // Samo za agente, need approval form supervisor
}
