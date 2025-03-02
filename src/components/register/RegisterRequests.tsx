import {RegisterRequestClient, RegisterRequestEmployee} from "@/types/auth.ts";
import {format} from "date-fns";
import {Role} from "@/types/enums.ts";
import {registerClient, registerEmployee} from "@/api/auth.ts";

// @ts-expect-error Need to add type to the props
export async function onSubmitEmployee({form, nextStep, setError}) {
    setError(null);
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
            // console.log("NEXT STEP");
            nextStep(registerData);
        }

    } catch (error) {
        console.error("Register for employee failed:", error);
        setError({
            id: Date.now(),
            title: "Failed to register employee",
            description: error && typeof error === "object" && "message" in error
                ? String(error.message)
                : String(error || "An error occurred"),
        });
    }
}

// @ts-expect-error Need to add type to the props
export async function onSubmitClient({form, nextStep, setError}) {
    setError(null);
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
                    // console.log("NEXT STEP");
                    nextStep(registerData);
                }}
        )
    } catch (error) {
        console.error("Register for client failed:", error);
        setError({
            id: Date.now(),
            title: "Failed to log in",
            description: error && typeof error === "object" && "message" in error
                ? String(error.message)
                : String(error || "An error occurred"),
        });
    }
}