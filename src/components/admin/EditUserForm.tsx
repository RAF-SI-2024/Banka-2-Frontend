import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getUserById, updateClient, updateEmployee } from "@/api/user.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ErrorAlert } from "@/components/common/ErrorAlert.tsx";
import { User } from "@/types/user.ts";
import { createFormSchema, getFormFields } from "@/components/utils/form-fields.tsx";
import { FormFieldRenderer } from "@/components/admin/FormFieldRendered.tsx";	

interface EditFormProps extends React.ComponentProps<"div"> {
    id_: number;
    onClose: () => void;
}

export default function EditUserForm({ id_, className, onClose, ...props }: EditFormProps) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Array<{ id: number; title: string, description: string }>>([]);
    const [userData, setUserData] = useState<User | null>(null);
    const [formFields, setFormFields] = useState<any[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Create a type-safe form using a default schema initially
    const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(createFormSchema('Client'));
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    // Watch form values to detect changes
    const watchedValues = form.watch();
    
    useEffect(() => {
        if (userData) {
            // Compare current form values with original data
            let formChanged = false;
            
            Object.keys(watchedValues).forEach(key => {
                if (watchedValues[key] !== userData[key as keyof typeof userData]) { 
                    console.log("Form value changed:", key, watchedValues[key], userData[key as keyof typeof userData]);
                    formChanged = true;
                }
            });
            
            setHasChanges(formChanged);
            console.log("Form has changes:", formChanged);
        }
    }, [watchedValues, userData]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                // const user = await getUserById(id_);
                const user = {} as User;
                // set user data to be same as formDataValues
                user.firstName = "John";
                user.lastName = "Doe";
                user.phoneNumber = "1234567890";
                user.address = "123 Main St";
                user.activated = true;

                setUserData(user);
                
                // Determine if user is a client or employee based on API response
                // const userRole = user.role as 'Client' | 'Admin' | 'Employee';
                const userRole = 'Employee';
                
                // Set schema and form fields based on role
                setFormSchema(createFormSchema(userRole));
                setFormFields(getFormFields(userRole));
                
                // Create default values for the form based on role
                const formDefaultValues: any = {};
                
                if (userRole === 'Client') {
                    // formDefaultValues.firstName = user.firstName;
                    // formDefaultValues.lastName = user.lastName;
                    // formDefaultValues.phoneNumber = user.phoneNumber;
                    // formDefaultValues.address = user.address;
                    // formDefaultValues.activated = user.activated;
                    // create random values for testing
                    formDefaultValues.firstName = "John";
                    formDefaultValues.lastName = "Doe";
                    formDefaultValues.phoneNumber = "1234567890";
                    formDefaultValues.address = "123 Main St";
                    formDefaultValues.activated = true;

                } else {
                    formDefaultValues.firstName = user.firstName;
                    formDefaultValues.lastName = user.lastName;
                    formDefaultValues.username = (user as any).username;
                    formDefaultValues.phoneNumber = user.phoneNumber;
                    formDefaultValues.address = user.address;
                    formDefaultValues.role = user.role;
                    formDefaultValues.department = (user as any).department;
                    formDefaultValues.employed = (user as any).employed;
                    formDefaultValues.activated = user.activated;
                }
                
                // Fill the form with user data
                form.reset(formDefaultValues);
                
            } catch (error) {
                console.error("❌ Failed to fetch user data:", error);
                setErrors(prev => [...prev, {
                    id: Date.now(),
                    title: "Failed to fetch user data",
                    description: "An error occurred while fetching user data"
                }]);
            }
        }

        fetchUserData();
    }, [id_, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrors([]); // Clear errors on submit
        
        if (!userData) {
            setErrors(prev => [...prev, {
                id: Date.now(),
                title: "User data missing",
                description: "Cannot update user because the original data is missing"
            }]);
            return;
        }

        // Check if anything has changed
        if (!hasChanges) {
            console.log("Nothing has changed");
            onClose();
            return;
        }

        try {
            // Prepare updated user data for API
            const updatedUser = {...values};
            
            let response;
            
            if (userData.role === 'Client') {
                response = await updateClient(updatedUser);
            } else {
                response = await updateEmployee(updatedUser);
            }
            if (response.success) {
                navigate("/home", { replace: true });
                return;
            } else {
                setErrors(prev => [...prev, {
                    id: Date.now(),
                    title: "Failed to update user",
                    description: "An error occurred while updating user details"
                }]);
            }
        } catch (error) {
            console.error("❌ Update failed:", error);
            setErrors(prev => [...prev, {
                id: Date.now(),
                title: "Failed to update user",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),
            }]);
        }
    }

    const removeError = (id: number) => {
        setErrors(prev => prev.filter(error => error.id !== id));
    };

    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {formFields.map((field) => (
                        <FormFieldRenderer 
                            key={field.name}
                            field={field} 
                            control={form.control} 
                        />
                    ))}
                    
                    <Button 
                        type="submit" 
                        variant="gradient" 
                        className="w-full" 
                        disabled={!hasChanges}
                    >
                        Update
                    </Button>
                </form>
            </Form>

            {errors.map((error) => (
                <ErrorAlert
                    key={error.id}
                    title={error.title}
                    description={error.description}
                    onClose={() => removeError(error.id)}
                />
            ))}
        </div>
    );
}