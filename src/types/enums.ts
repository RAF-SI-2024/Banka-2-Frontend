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
