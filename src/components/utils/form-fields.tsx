import * as z from "zod";
import {Role} from "@/types/enums.ts";

// Dynamic schema generation based on role
export const createFormSchema = (role: Role) => {
    if (role === Role.Client) {
        return z.object({
            firstName: z.string().min(1, "First Name is required"),
            lastName: z.string().min(1, "Last Name is required"),
            phoneNumber: z.string().min(1, "Phone Number is required"),
            address: z.string().min(1, "Address is required"),
            activated: z.boolean()
        });
    } else {
        return z.object({
            firstName: z.string().min(1, "First Name is required"),
            lastName: z.string().min(1, "Last Name is required"),
            username: z.string().min(1, "Username is required"),
            phoneNumber: z.string().min(1, "Phone Number is required"),
            address: z.string().min(1, "Address is required"),
            role: z.nativeEnum(Role),
            department: z.string().min(1, "Department is required"),
            // employed: z.boolean(),
            activated: z.boolean()
        });
    }
};

// Form field configuration based on role
export const getFormFields = (role: Role) => {
    if (role === Role.Client) {
        return [
            {
                label: "First Name",
                name: "firstName",
                placeholder: "First name",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Last Name",
                name: "lastName",
                placeholder: "Last name",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Phone Number",
                name: "phoneNumber",
                placeholder: "Phone Number",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Address",
                name: "address",
                placeholder: "Address",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Activated",
                name: "activated",
                placeholder: "",
                required: false,
                type: "checkbox",
                variant: "Checkbox"
            }
        ];
    } else {
        return [
            {
                label: "First Name",
                name: "firstName",
                placeholder: "First name",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Last Name",
                name: "lastName",
                placeholder: "Last name",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Username",
                name: "username",
                placeholder: "Username",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Phone Number",
                name: "phoneNumber",
                placeholder: "Phone Number",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Address",
                name: "address",
                placeholder: "Address",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Role",
                name: "role",
                placeholder: "Select role",
                required: true,
                type: "select",
                variant: "Select",
                options: [
                    { value: Role.Admin, label: "Admin" },
                    { value: Role.Employee, label: "Employee" }
                ]
            },
            {
                label: "Department",
                name: "department",
                placeholder: "Department",
                required: true,
                type: "text",
                variant: "Input"
            },
            {
                label: "Employed",
                name: "employed",
                placeholder: "",
                required: false,
                type: "checkbox",
                variant: "Checkbox"
            },
            {
                label: "Activated",
                name: "activated",
                placeholder: "",
                required: false,
                type: "checkbox",
                variant: "Checkbox"
            }
        ];
    }
};