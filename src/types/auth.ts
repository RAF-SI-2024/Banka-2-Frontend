import {Gender, Role} from "@/types/user.ts";

export let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
    globalLogout = logoutFn;
};


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
    employed?: boolean;
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