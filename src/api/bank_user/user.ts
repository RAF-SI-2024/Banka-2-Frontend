import {api_bank_user} from "../axios.ts";
import {EditUserRequest, GetUserRequest, UpdateClientRequest, UpdateEmployeeRequest, User, UserResponse} from "@/types/bank_user/user.ts";

export const getAllUsers = async (
    page: number,
    size: number,
    filters: { email?: string; firstName?: string; lastName?: string; role?: string }
): Promise<UserResponse> => {
    try {
        const response = await api_bank_user.get("/users", {
            params: {
                email: filters.email || undefined,
                firstName: filters.firstName || undefined,
                lastName: filters.lastName || undefined,
                role: filters.role ? parseInt(filters.role, 10) : undefined, // Convert role to number
                page,
                size,
            },
        });

        return response.data; // API returns an array of users
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        throw error;
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await api_bank_user.get(`/users/${id}`);
        return response.data; // Returns user data
    } catch (error) {
        console.error("Failed to get specific user! :", error);
        throw error;
    }
};


export const updateClient = async (data: UpdateClientRequest, id: string) => {
    try {
        const response = await api_bank_user.put(`/clients/${id}`, data);
        return { 
            success: true, 
            data: response.data 
        };
    } catch (error) {
        console.error("❌ Failed to update client:", error);
        throw error;
    }
};

export const updateEmployee = async (data: UpdateEmployeeRequest, id: string) => {
    try {
        const response = await api_bank_user.put(`/employees/${id}`, data);
        return { 
            success: true, 
            data: response.data 
        };
    } catch (error) {
        console.error("❌ Failed to update employee:", error);
        throw error;
    }
};


export const editUser = async (data: EditUserRequest) => {
    try {
        const response = await api_bank_user.put(`/users/editUser`, data) //Address will have to be updated
        return response.data // Returns token or user data
    } catch (error) {
        console.error("❌ Edit failed:", error)
        throw error
    }
}

export const getUser = async (data: GetUserRequest) => {
    try {
        // const response = await api_bank_user.get(`${API_BASE}/users/{id}`, data); //Address will have to be updated
        // return response.data; // Returns token or user data

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
            activated: false,
        }
        return res
    } catch (error) {
        console.error("❌ Edit failed:", error)
        throw error
    }
}

export const getAllClients = async (
    page: number,
    size: number,
    filters: { email?: string; firstName?: string; lastName?: string;}
): Promise<UserResponse> => {
    try{
        const response = await api_bank_user.get("/clients", {
            params: {
                email: filters.email || undefined,
                firstName: filters.firstName || undefined,
                lastName: filters.lastName || undefined,
                page,
                size,
            },
        });
        return response.data;
    }catch (error){
        console.error("❌ Error fetching clients:", error);
        throw error;
    }
}