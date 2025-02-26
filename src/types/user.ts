export interface UserModel {
    id: string; // Using string since the backend uses Guid
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female';
    uniqueIdentificationNumber: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: 'Admin' | 'Employee' | 'Client';
    department: string;
    createdAt: Date;
    modifiedAt: Date;
    employed: boolean;
    activated: boolean;
  }