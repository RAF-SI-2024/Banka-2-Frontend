import {RegisterRequestClient, RegisterRequestEmployee} from "@/types/auth.ts";
import {format} from "date-fns";
import {Role} from "@/types/enums.ts";
import {registerClient, registerEmployee} from "@/api/auth.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

// @ts-expect-error Need to add type to the props
export async function onSubmitEmployee({form, nextStep}) {
    try {
        const registerData: RegisterRequestEmployee = {
            username: form.getValues("username"),
            department: form.getValues("department"),
            email: form.getValues("email"),
            firstName: form.getValues("firstName"),
            lastName: form.getValues("lastName"),
            dateOfBirth: format(new Date(form.getValues("dateOfBirth")), "yyyy-MM-dd"),
            uniqueIdentificationNumber: form.getValues("uniqueIdentificationNumber"),
            gender: parseInt(form.getValues("gender"), 10), // Convert string to number
            phoneNumber: form.getValues("phoneNumber"),
            address: form.getValues("address"),
            role: Role.Employee,
        };

        const response = await registerEmployee(registerData);
        if (response.status === 200) {
            showSuccessToast({description: "Employee registered successfully"})
            nextStep(registerData);
        }

    } catch (error) {
        console.error("Register for employee failed:", error);
        showErrorToast({error, defaultMessage:"Employee registration failed."});
    }
}

// @ts-expect-error Need to add type to the props
export async function onSubmitClient({form, nextStep}) {
    try {
        const registerData: RegisterRequestClient = {
            email: form.getValues("email"),
            firstName: form.getValues("firstName"),
            lastName: form.getValues("lastName"),
            dateOfBirth: format(new Date(form.getValues("dateOfBirth")), "yyyy-MM-dd"),
            uniqueIdentificationNumber: form.getValues("uniqueIdentificationNumber"),
            gender: parseInt(form.getValues("gender"), 10), // Convert string to number
            phoneNumber: form.getValues("phoneNumber"),
            address: form.getValues("address"),
            role: Role.Client,
        };

        await registerClient(registerData).then(
            (response) => {
                if (response.status === 200) {
                    showSuccessToast({description: "Client registered successfully"})
                    nextStep(registerData);
                }}
        )
    } catch (error) {
        console.error("Register for client failed:", error);
        showErrorToast({error, defaultMessage:"Client registration failed."});
    }
}