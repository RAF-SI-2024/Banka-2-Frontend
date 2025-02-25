import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { updateUser } from "@/api/user.ts"; // Assume you have an API function to update user details
import { useAuth } from "@/hooks/useAuth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

export default function EditUserForm({ className, ...props }: React.ComponentProps<"div">) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Array<{ id: number; title: string, description: string }>>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            // firstName: user?.firstName || "",
            // lastName: user?.lastName || "",
            // username: user?.username || ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrors([]); // Clear errors on submit
        try {
            // const response = await updateUser(values);
            // if (response.success) {
            //     navigate("/home", { replace: true }); TODO: // Redirect to user profile page
            // } else {
            //     setErrors(prev => [...prev, {
            //         id: Date.now(),
            //         title: "Failed to update user",
            //         description: "An error occurred while updating user details"
            //     }]);
            // }
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
                            <Button type="submit" variant="gradient" className="w-full">
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