import {Gender, Role} from "@/types/enums.ts";

// Client Model
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

// Employee Model
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

export interface UserTableProps {
    search: {
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
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
