import * as React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import InputHidable from "@/components/__common__/input/InputHidable.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import { resetPassword} from "@/api/bank_user/auth.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

// Form field definitions
const data = [
    {
        checked: true,
        label: "Create Password",
        name: "password",
        id: "password",
        placeholder: "********",
        placeholderVisible: "abcdefgh",
        required: true,
        type: "password",
        variant: "Password",
    },
    {
        checked: true,
        label: "Confirm Password",
        name: "confirmPassword",
        id: "confirmPassword",
        placeholder: "********",
        placeholderVisible: "abcdefgh",
        required: true,
        type: "password",
        variant: "Password",
    },
]

// Schema for validation
const formSchema = z.object({
        password: z
            .string()
            .min(1, "This field is required")
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/(?=(.*\d){2})/, "Password must contain at least two numbers"),
        confirmPassword: z
            .string()
            .min(1, "This field is required")
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/(?=(.*\d){2})/, "Password must contain at least two numbers")
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })



export default function NewPasswordForm({ className, ...props }: React.ComponentProps<"div">) {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await resetPassword(values.password, values.confirmPassword, token || '');

            if (response.status==202) {
                showSuccessToast({description: "Password reset successful."})
                navigate("/login");
            } else {
                throw new Error("Failed to reset password");
            }
        } catch (error) {
            showErrorToast({error: error, defaultMessage: "Failed to reset password"});
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
                                    name={field.name as "password" | "confirmPassword"}
                                    render={({ field: fieldProps }) => (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <InputHidable
                                                    placeholder={field.placeholder}
                                                    placeholderVisible={field.placeholderVisible}
                                                    id={field.name}
                                                    {...fieldProps}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button type="submit" variant="gradient" className="w-full">
                                Reset
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>


        </div>
    );
}