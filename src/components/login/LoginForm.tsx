import * as React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth.ts";
import { LoginRequest } from "@/types/auth.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import InputHidable from "@/components/common/InputHidable"
import { Card, CardContent } from "@/components/ui/card";



const formSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty("Invalid password"),
});

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            const loginData: LoginRequest = {
                email: values.email,
                password: values.password,
            };

            const response = await loginUser(loginData); // Call API
            if (response.jwt) {
                login(response.jwt); // Store token in context & localStorage
                navigate("/home", { replace: true }); // Redirect to home
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
            setError("Failed to login. Please check your credentials.");
        }
    }

    return (
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
            <CardContent className="mt-4 font-paragraph">
                {error && <p className="text-red-500">{error}</p>} {/* Display errors */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@example.com" id="email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        <Button variant="link" size="tight" className="ml-auto">
                                            Forgot your password?
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <InputHidable placeholder="********" placeholderVisible="abcdefgh" id="password" required={true} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type="submit" variant="gradient" className="w-full">
                            Log in
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
