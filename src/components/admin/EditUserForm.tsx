import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "@/api/user.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ErrorAlert } from "@/components/common/ErrorAlert.tsx";

// Form field definitions
const data = [
    {
        checked: true,
        label: "First Name",
        name: "firstName",
        placeholder: "First name",
        required: true,
        type: "text",
        variant: "Input"
    },
    {
        checked: true,
        label: "Last Name",
        name: "lastName",
        placeholder: "Last name",
        required: true,
        type: "text",
        variant: "Input"
    },
    {
        checked: true,
        label: "Username",
        name: "username",
        placeholder: "Username",
        required: true,
        type: "text",
        variant: "Input"
    }
];

// Schema for validation
const formSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    username: z.string().min(1, "Username is required"),
});

interface EditFormProps extends React.ComponentProps<"div"> {
    id_: number;
    onClose: () => void;
}

export default function EditUserForm({ id_, className, onClose, ...props }: EditFormProps) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Array<{ id: number; title: string, description: string }>>([]);
    const [originalData, setOriginalData] = useState<{
        firstName: string;
        lastName: string;
        username: string;
    } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "a",
            lastName: "a",
            username: "a"
        },
    });

    // Watch form values to detect changes
    const watchedValues = form.watch();
    
    // Check for changes when form values update
    useEffect(() => {
        if (originalData) {
            const formChanged = 
                originalData.firstName !== watchedValues.firstName ||
                originalData.lastName !== watchedValues.lastName ||
                originalData.username !== watchedValues.username;
            
            setHasChanges(formChanged);
            console.log("Form has changes:", formChanged);
        }
    }, [watchedValues, originalData]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await getUserById(id_);
                
                // Store the original form data for comparison
                const formData = {
                    // firstName: userData.firstName,
                    // lastName: userData.lastName,
                    // username: userData.username
                    firstName: "a",
                    lastName: "a",
                    username: "a"
                };
                console.log("Original data has been set!:", formData);
                setOriginalData(formData);
                
                // Fill the form with user data
                form.reset(formData);
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
        
        if (!originalData) {
            setErrors(prev => [...prev, {
                id: Date.now(),
                title: "User data missing",
                description: "Cannot update user because the original data is missing"
            }]);
            return;
        }

        // Additional check to ensure there are actual changes
        if (!hasChanges) {
            console.log("Nothing has changed");
            onClose();
            return;
        }

        try {
            const updatedUser = {
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username
            };
            
            const response = await updateUser(id_, updatedUser);
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
                    {data.map((field) => (
                        <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name as "firstName" | "lastName" | "username"}
                            render={({ field: fieldProps }) => (
                                <FormItem>
                                    <FormLabel>{field.label}</FormLabel>
                                    <FormControl>
                                        <Input id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
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