import * as React from "react";
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
import InputHidable from "@/components/common/input/InputHidable.tsx";
import { Card, CardContent } from "@/components/ui/card";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const loginData: LoginRequest = { email: values.email, password: values.password };
            const response = await loginUser(loginData);

            if (response.token && response.user) {
                login(response.token, response.user); // Store full user data
                console.log("✅ Login successful", response);
                navigate("/home", { replace: true });
            } else {
                throw new Error("Login failed.");
            }
        } catch (error) {
            console.error("❌ Login failed:", error);

            showErrorToast({error, defaultMessage: "Log in failed."})
        }
    }


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
                                                <Button type="button" variant="link" size="tight" className="ml-auto" tabIndex={4} onClick={() => navigate("/password-reset")}>
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
                                                    tabIndex={2}
                                                />
                                            ) : (
                                                <Input id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} tabIndex={1}/>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="submit" variant="gradient" tabIndex={3} className="w-full">
                            Log in
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        </div>
    );
}
