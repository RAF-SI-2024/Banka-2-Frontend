import api from "./axios";
import { API_BASE } from "../constants/endpoints";
import {LoginRequest, RegisterRequestClient, RegisterRequestEmployee, RegisterRequest} from "@/types/auth";
import { EditUserRequest } from "@/types/user";
import { GetUserRequest } from "@/types/user";

export const loginUser = async (data: LoginRequest) => {
  try {
    const response = await api.post(`${API_BASE}/users/login`, data)
    return response.data // Returns token or user data
  } catch (error) {
    console.error("❌ Login failed:", error)
    throw error
  }
}

export const registerUser = async (data: RegisterRequest) => {
  try {
    const response = await api.post(`${API_BASE}/users/register`, data)
    return response.data
  } catch (error) {
    console.error("❌ Register failed:", error)
    throw error
  }
}

export const registerClient = async (data: RegisterRequestClient) => {
    console.log(data)
    try {
        const response = await api.post(`${API_BASE}/clients`, data);
        return response.data;
    } catch (error) {
        console.error("❌ Register client failed:", error);
        throw error;
    }
};


export const registerEmployee = async (data: RegisterRequestEmployee) => {
    console.log(data)
    try {
        const response = await api.post(`${API_BASE}/employees`, data);
        return response.data;
    } catch (error) {
        console.error("❌ Register employee failed:", error);
        throw error;
    }
};