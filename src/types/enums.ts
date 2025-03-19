export enum Role {
    Invalid = 0,
    Admin = 1,
    Employee = 2,
    Client = 3,
}


export enum Gender {
    Invalid = 0,
    Male = 1,
    Female = 2,
}

export enum InterestType {
    Fixed,
    Variable,
    Mixed
}

export enum LoanStatus {
    Pending,
    Active,
    Rejected,
    Closed,
    DefaultWarning,
    Default
}

export enum InstallmentStatus {
    Pending,
    Paid,
    Overdue,
    Cancelled
}


export const getRoleNumber = (roleName: string): number => {
    switch (roleName.toLowerCase()) {
        case "admin":
            return Role.Admin;
        case "employee":
            return Role.Employee;
        case "client":
            return Role.Client;
        default:
            return Role.Invalid;
    }
};

export const getRoleString = (role: Role): string => {
    switch (role) {
        case Role.Admin:
            return "Admin";
        case Role.Employee:
            return "Employee";
        case Role.Client:
            return "Client";
        default:
            return "Unknown";
    }
};


export const getGenderString = (gender: Gender) => {
    switch (gender) {
        case Gender.Male:
            return "Male";
        case Gender.Female:
            return "Female";
        default:
            return "Unknown";
    }
};

export const getInterestRate = (type: number) => {
    switch (type) {
        case 0: 
            return "Fixed";
        case 1:
            return "Variable";
        default:
            return "Unknown";
    
    }
}

