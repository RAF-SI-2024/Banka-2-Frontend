import * as React from "react"
import {useEffect} from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams} from "react-router-dom"
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
import InputHidable from "@/components/common/input/InputHidable.tsx"
import { Card, CardContent } from "@/components/ui/card"
import {showErrorToast, showSuccessToast} from "@/utils/show-toast-utils.tsx";

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
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z
      .string()
      .min(1, "This field is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function RegisterPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


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

    try {

      if(!token)
        throw new Error("No token provided")

      const response = await activateUser(values, token);

      console.log("RESPONSE", response)
      if(response.status === 202){
          showSuccessToast({description:"Account created successfully", title: "Registration complete"})
          navigate("/login", {replace: true});
      }

    } catch (error) {
      console.error("❌ Password creation failed:", error)
      showErrorToast({error, defaultMessage: "Password creation failed."})
    }
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


    </div>
  )
}
