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