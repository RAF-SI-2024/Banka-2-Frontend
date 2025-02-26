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

export type User = ClientUser | EmployeeUser;