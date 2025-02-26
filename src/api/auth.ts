import api from "./axios"
import { API_BASE } from "../constants/endpoints"
import { LoginRequest } from "../types/auth"
import { RegisterRequest } from "../types/auth"

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
