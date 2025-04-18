import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {LoginRequest, RequestPasswordReset} from "@/types/bank_user/auth.ts";
import {loginUser, requestPasswordReset} from "@/api/bank_user/auth.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

const formSchema = z.object({
  email: z.string().min(1).optional(),
  password: z
    .string()
    .min(1, "This field is required")
});

interface ConfirmProps {
  setShowDialog: (open: boolean) => void;
}

export default function ConfirmCurrentPassword({ setShowDialog}: ConfirmProps) {

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const rawData = sessionStorage.getItem("user");
  let email = ""

  if (rawData) {
    const user = JSON.parse(rawData);
    email = user.email;
  }

  // Funkcija se poziva nakon uspesnog logina. Salje se zahtev za promenu sifre
  // Mozda je bolje da se ovo odraduje u komponenti "Uspesno poslat mejl za reset sifre"
  // Posto je ta komponenta cela ruta, ostavljam vama da prilagodite gde se poziva
  async function sendPasswordResetRequest() {
    try {
      const requestData: RequestPasswordReset = { email: email}
      const response = await requestPasswordReset(requestData.email);
      console.log(response)
    } catch (error) {
      showErrorToast({error, defaultMessage: "Password reset request failed."})
      console.log(error)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loginData: LoginRequest = { email: email, password: values.password };
      const response = await loginUser(loginData);
      if (response.token) {
        console.log("✅ Old password confirmation successful", response);
        setShowDialog(false)

        await sendPasswordResetRequest();
        showSuccessToast({title: "Password change request sent", description: "Check your email to continue resetting your password"});
        // navigate("/resetNotification", { state: { email: values.email }})
      } else {
        throw new Error("Password reset request failed.");
      }
    } catch (error) {
      console.error("Failed to authenticate:", error);
      showErrorToast({error, defaultMessage: "Password is incorrect."})
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
                    placeholder={email}
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