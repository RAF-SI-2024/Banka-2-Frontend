export interface LoginRequest {
    email: string;
    password: string;
}

export interface EditUserRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    date: Date;
    gender: number;
    uniqueidentificationnumber: string;
    username: string;
    phonenumber: string;
    address: string; 
    department: string;
    role: number;
    activated: boolean;
}

export interface GetUserRequest {
    uniqueidentificationnumber: string;
}

export interface RegisterRequestClient {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    uniqueIdentificationNumber: string;

    // male = 0; female = 1;
    gender: string;
    phoneNumber: string;
    address: string;

    // client = 0
    role: string;
}

export interface RegisterRequestEmployee {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    uniqueIdentificationNumber: string;

    // male = 0; female = 1;
    gender: string;
    username: string;
    department: string;

    // employed = 1, unemployed = 0
    employed: string;
    phoneNumber: string;
    address: string;

    // employee = 1
    role: string;
}