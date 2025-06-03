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
export enum Permission {
  Invalid = 0,
  Client = 1,
  Employee = 2,
  Admin = 4,
  Trade = 8,
  ApproveTrade = 16,
  Agent = 10, // Employee (2) | Trade (8)
  Supervisor = 26, // Employee (2) | Trade (8) | ApproveTrade (16)
}

export interface Actuary {
  id: string;
  employeeId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  actuaryType: Permission;
  limit: number;
  usedLimit: number;
  needsApproval: boolean;
}

// Helper funkcija - prikazivanje enuma kao string
export function getActuaryTypeLabel(type: Permission): string {
  switch (type) {
    case Permission.Supervisor:
      return "Supervisor";
    case Permission.Agent:
      return "Agent";
    default:
      return "None";
  }
}

