import {Permission} from "@/types/bank_user/actuary.ts";

export interface Client {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // YYYY-MM-DD format
    gender: Gender; // Uses the Gender enum
    uniqueIdentificationNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface Employee {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // YYYY-MM-DD format
    gender: Gender; // Uses the Gender enum
    uniqueIdentificationNumber: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: Role; // Uses Role enum
    department: string;
    employed: boolean;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    uniqueIdentificationNumber: string;
    email: string;
    username: string;
    permissions: Permission;
    phoneNumber: string;
    address: string;
    role: Role;
    department?: string;
    accounts: AccountSimple[];
    createdAt: string;
    modifiedAt: string;
    activated: boolean;
}


export interface UserResponse {
    items: User[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export interface UpdateClientRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    activated: boolean;
}

export interface UpdateEmployeeRequest {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    address: string;
    role: Role;
    department: string;
    employed: boolean;
    activated: boolean;
}    

export interface AccountSimple {
    id: string;
    accountNumber: string;
}

export interface EditUserRequest {
    firstname: string
    lastname: string
    email: string
    password: string
    date: Date
    gender: number
    uniqueidentificationnumber: string
    username: string
    phonenumber: string
    address: string
    department: string
    role: Role
    activated: boolean
}

export interface GetUserRequest {
    uniqueidentificationnumber: string
}



// ENUMS

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