export interface BaseUser {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    activated: boolean;
    role: 'Client' | 'Admin' | 'Employee';
}

export interface ClientUser extends BaseUser {
    role: 'Client';
}

export interface EmployeeUser extends BaseUser {
    role: 'Admin' | 'Employee';
    username: string;
    department: string;
    employed: boolean;
}

/*export type User = ClientUser | EmployeeUser;*/

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    uniqueIdentificationNumber: string;
    email: string;
    username: string;
    phoneNumber: string;
    address: string;
    role: Role;
    department?: string;
    accounts: AccountSimple[];
    createdAt: string;
    modifiedAt: string;
    activated: boolean;
}


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


export interface AccountSimple {
    id: string;
    accountNumber: string;
}

export interface UserTableProps {
    search: {
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}