import {api_bank_user} from "../axios.ts";
import {
  LoginRequest,
  RegisterRequestClient,
  RegisterRequestEmployee,
  RegisterRequest,
  ActivateRequest
} from "@/types/bank_user/auth.ts";


export const loginUser = async (data: LoginRequest) => {
  try {
    const response = await api_bank_user.post(`/users/login`, data)
    return response.data // Returns token or user data
  } catch (error) {
    console.error("❌ Login failed:", error)
    throw error
  }
}

export const registerUser = async (data: RegisterRequest) => {
  try {
    const response = await api_bank_user.post(`/users/register`, data)
    return response.data
  } catch (error) {
    console.error("❌ Register failed:", error)
    throw error
  }
}

export const registerClient = async (data: RegisterRequestClient) => {
    try {
        const response = await api_bank_user.post(`/clients`, data);
        console.log("REGISTER CLIENT", response)
        return response;
    } catch (error) {
        console.error("❌ Register client failed:", error);
        throw error;
    }
};


export const registerEmployee = async (data: RegisterRequestEmployee) => {
    try {
        data.employed = true;
        const response = await api_bank_user.post(`/employees`, data);
        return response;
    } catch (error) {
        console.error("❌ Register employee failed:", error);
        throw error;
    }
};

export const activateUser = async (data: ActivateRequest, token:string) => {
    try {
        const response = await api_bank_user.post(`/users/activate?token=${token}`, data)
        return response
    } catch (error) {
        console.error("❌ Activation failed:", error)
        throw error
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await api_bank_user.post(`/users/password-reset/request`, { email });
        return response
    } catch (error) {
        console.error("❌ Password reset request failed:", error);
        throw error;
    }
}

export const resetPassword = async (password: string, confirmPassword: string, token: string) => {
    try {
        const response = await api_bank_user.post(`/users/password-reset?token=${token}`, { password, confirmPassword });
        return response
    } catch (error) {
        console.error("❌ Password reset failed:", error);
        throw error;
    }
}

export const updateAccountLimits = async (clientId: string | undefined, name: string, dailyLimit: number, monthlyLimit: number) => {
    try {
        const response = await api_bank_user.put(`/accounts/client/${clientId}`, {
            name: name,
            dailyLimit: dailyLimit,
            monthlyLimit: monthlyLimit
        });
        return response
    } catch (error) {
        console.error("❌ Update account limits failed:", error);
        throw error;
    }
};