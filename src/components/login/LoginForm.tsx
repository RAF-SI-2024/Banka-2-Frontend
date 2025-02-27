import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth.ts";
import { LoginRequest } from "@/types/auth.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputHidable from "@/components/common/InputHidable";
import { Card, CardContent } from "@/components/ui/card";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";

// Form field definitions
const data = [
    {
        checked: true,
        label: "Email",
        name: "email",
        placeholder: "example@example.com",
        required: true,
        type: "email",
        variant: "Input"
    },
    {
        checked: true,
        label: "Password",
        name: "password",
        placeholder: "********",
        placeholderVisible: "abcdefgh",
        required: true,
        type: "password",
        variant: "Password"
    }
];

// Schema for validation
const formSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Array<{ id: number; title:string, description: string }>>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrors([]); // Clear errors on submit
        try {
            const loginData: LoginRequest = { email: values.email, password: values.password };
            const response = await loginUser(loginData);
            if (response.token) {
                login(response.token);
                console.log("✅ Login successful", response);
                navigate("/home", { replace: true });
            } else {
                setErrors(prev => [...prev, {
                    id: Date.now(),
                    title: "Failed to log in",
                    description: "Invalid credentials"
                }]);
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
            setErrors(prev => [...prev, {
                id: Date.now(),
                title: "Failed to log in",
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
        <div className="flex flex-col gap-2">
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
            <CardContent className="mt-4 font-paragraph">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {data.map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as "email" | "password"}
                                render={({ field: fieldProps }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>{field.label}</FormLabel>
                                            {field.name === "password" && (
                                                <Button type="button" variant="link" size="tight" className="ml-auto" onClick={() => navigate("/password-reset")}>
                                                    Forgot your password?
                                                </Button>
                                            )}
                                        </div>
                                        <FormControl>
                                            {field.variant === "Password" ? (
                                                <InputHidable
                                                    placeholder={field.placeholder}
                                                    placeholderVisible={field.placeholderVisible}
                                                    id={field.name}
                                                    {...fieldProps}
                                                />
                                            ) : (
                                                <Input id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="submit" variant="gradient" className="w-full">
                            Log in
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

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
