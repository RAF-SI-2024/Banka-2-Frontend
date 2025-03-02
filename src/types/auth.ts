import {Gender, Role} from "@/types/enums.ts";

export interface LoginRequest {
  email: string
  password: string
}

export interface ActivateRequest {
    password: string
    confirmPassword: string
}

export interface RegisterRequestEmployee {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    uniqueIdentificationNumber: string;
    gender: Gender;
    username: string;
    department: string;
    phoneNumber: string;
    address: string;
    role: Role;
}

export interface RegisterRequest {
    password: string
}


export interface RegisterRequestClient {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    uniqueIdentificationNumber: string;
    gender: Gender;
    phoneNumber: string;
    address: string;
    role: Role;

}
export interface RequestPasswordReset {
    email: string
}