import api from "./axios";
import { API_BASE } from "../constants/endpoints";
import { LoginRequest } from "../types/auth";
import { EditUserRequest } from "../types/auth";
import { GetUserRequest } from "../types/auth";

export const loginUser = async (data: LoginRequest) => {
    try {
        const response = await api.post(`${API_BASE}/users/login`, data);
        return response.data; // Returns token or user data
    } catch (error) {
        console.error("❌ Login failed:", error);
        throw error;
    }
};

export const editUser = async (data: EditUserRequest) => {
    try {
        const response = await api.put(`${API_BASE}/users/editUser`, data); //Address will have to be updated
        return response.data; // Returns token or user data
    } catch (error) {
        console.error("❌ Edit failed:", error);
        throw error;
    }
};

export const getUser = async (data: GetUserRequest) => {
    try {
        //const response = await api.get(`${API_BASE}/users/{id}`, data); //Address will have to be updated
        //return response.data; // Returns token or user data
        
        // For testing purposes
        const res = { 
            firstname: "Mole",
            lastname: "Peric",
            email: "ajao@raf.rs",
            password: "123412342134",
            date: new Date(),
            gender: 2,
            uniqueidentificationnumber: "1234567891234",
            username: "Voja",
            phonenumber: "+38167123443",
            address: "Moja Gajba",
            department: "",
            role: 1,
            activated: false
        };
        return res;
        
    } catch (error) {
        console.error("❌ Edit failed:", error);
        throw error;
    }
};