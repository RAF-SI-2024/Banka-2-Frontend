// // Actuary tipovi koji definišu oblik podataka
// export interface Actuary {
//   id: string;
//   employeeId: string;
//   isAgent: boolean;
//   isSupervisor: boolean;
//   limit?: number; // Samo za agente
//   usedLimit?: number; // Samo za agente
//   needApproval?: boolean; // Samo za agente, need approval form supervisor
// }

// Enum za actuary tipove
export enum ActuaryType {
  None = 0,
  Supervisor = 1,
  Agent = 2,
}

export interface Actuary {
  id: string;
  employeeId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  actuaryType: ActuaryType;
  limit: number;
  usedLimit: number;
  needsApproval: boolean;
}

// Helper funkcija - prikazivanje enuma kao string
export function getActuaryTypeLabel(type: ActuaryType): string {
  switch (type) {
    case ActuaryType.Supervisor:
      return "Supervisor";
    case ActuaryType.Agent:
      return "Agent";
    default:
      return "None";
  }
}

