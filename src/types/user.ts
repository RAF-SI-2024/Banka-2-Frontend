export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // DateOnly is not a standard JavaScript type, so using string
    gender: number;
    uniqueIdentificationNumber: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: number;
    department?: string; // Optional field
    createdAt: string; // DateTime is represented as string in JavaScript
    modifiedAt: string; // DateTime is represented as string in JavaScript
    activated: boolean;
}