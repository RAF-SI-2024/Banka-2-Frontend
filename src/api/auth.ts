import api from "./axios";
import { API_BASE } from "../constants/endpoints";
import {
    LoginRequest,
    RegisterRequestClient,
    RegisterRequestEmployee,
    RegisterRequest,
    ActivateRequest
} from "@/types/auth";


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
    try {
        const response = await api.post(`${API_BASE}/clients`, data);
        console.log("REGISTER CLIENT", response)
        return response;
    } catch (error) {
        console.error("❌ Register client failed:", error);
        throw error;
    }
};


export const registerEmployee = async (data: RegisterRequestEmployee) => {
    try {
        const response = await api.post(`${API_BASE}/employees`, data);
        return response;
    } catch (error) {
        console.error("❌ Register employee failed:", error);
        throw error;
    }
};

export const activateUser = async (data: ActivateRequest, token:string) => {
    try {
        const response = await api.post(`${API_BASE}/users/activate?token=${token}`, data)
        return response
    } catch (error) {
        console.error("❌ Activation failed:", error)
        throw error
    }
}