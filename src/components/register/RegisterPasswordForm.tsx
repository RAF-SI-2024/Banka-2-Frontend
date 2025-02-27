import * as React from "react"
import {useEffect, useState} from "react"
import { useForm } from "react-hook-form"
import {redirect, useNavigate, useSearchParams} from "react-router-dom"
import {activateUser} from "@/api/auth.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputHidable from "@/components/common/InputHidable"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorAlert } from "@/components/common/ErrorAlert.tsx"

// Form field definitions
const data = [
  {
    checked: true,
    label: "Create Password",
    name: "password",
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
    placeholder: "********",
    placeholderVisible: "abcdefgh",
    required: true,
    type: "confirmPassword",
    variant: "Password",
  },
]

// Schema for validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(1, "This field is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[.@$!%*?&]/,
        "Password must contain at least one special character (.@$!%*?&)"
      ),
    confirmPassword: z
      .string()
      .min(1, "This field is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[.@$!%*?&]/,
        "Password must contain at least one special character (.@$!%*?&)"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function RegisterPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [errors, setErrors] = useState<
    Array<{ id: number; title: string; description: string }>
  >([])

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
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {


    setErrors([]) // Clear errors on submit
    try {

      if(!token)
        throw new Error("No token provided")

      const response = await activateUser(values, token);

      if(response.status === 200){
          navigate("/login", {replace: true});
      }

    } catch (error) {
      console.error("❌ Password creation failed:", error)
      setErrors((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: "Registration failed",
          description:
            error && typeof error === "object" && "message" in error
              ? String(error.message)
              : String(error || "An error occurred"),
        },
      ])
    }
  }

  const removeError = (id: number) => {
    setErrors((prev) => prev.filter((error) => error.id !== id))
  }

  return (
    <div className="flex flex-col gap-2">
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
          <CardContent className="mt-4 font-paragraph">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 pt-5 pb-2"
              >
                {data.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as "password" | "confirmPassword"}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>{field.label}</FormLabel>
                          {field.name === "password"}
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
                            <Input
                              id={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              {...fieldProps}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <Button type="submit" variant="gradient" className="w-full">
                  Create Account
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
  )
}
