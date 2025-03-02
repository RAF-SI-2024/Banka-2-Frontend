import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {LoginRequest, RequestPasswordReset} from "@/types/auth.ts";
import {loginUser, requestPasswordReset} from "@/api/auth.ts";

const formSchema = z.object({
  email: z.string().min(1).optional(),
  password: z
    .string()
    .min(1, "This field is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type ErrorType = {
  id: number;
  title: string;
  description: string
} | null;

interface ConfirmProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  setErrors: (error: ErrorType) => void;
  setShowDialog: (open: boolean) => void;
}

export default function ConfirmCurrentPassword({user, setErrors, setShowDialog}: ConfirmProps) {

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // Funkcija se poziva nakon uspesnog logina. Salje se zahtev za promenu sifre
  // Mozda je bolje da se ovo odraduje u komponenti "Uspesno poslat mejl za reset sifre"
  // Posto je ta komponenta cela ruta, ostavljam vama da prilagodite gde se poziva
  async function sendPasswordResetRequest() {
    try {
      const requestData: RequestPasswordReset = { email: user.email}
      const response = await requestPasswordReset(requestData);
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loginData: LoginRequest = { email: user.email, password: values.password };
      const response = await loginUser(loginData);
      if (response.token) {
        console.log("✅ Login successful", response);
        setShowDialog(false)
        await sendPasswordResetRequest();
        navigate("/resetNotification")
      } else {
        setErrors({
          id: Date.now(),
          title: "Error authentication",
          description: "Password is incorrect"
        });
      }
    } catch (error) {
      console.error("Failed to authenticate:", error);
      setErrors({
        id: Date.now(),
        title: "Error while sending request",
        description: error && typeof error === "object" && "message" in error
          ? String(error.message)
          : String(error || "An error occurred"),
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">

          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder={user.email}
                    disabled
                    type=""
                    {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write your current password"
                    type="password"
                    {...field} />
                </FormControl>

                <FormMessage/>
              </FormItem>
            )}
          />
          <Button className="mt-12 w-full" type="submit">Confirm</Button>
        </form>
      </Form>
    </>
  )
}