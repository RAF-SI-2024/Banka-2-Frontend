import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import InputHidable from "@/components/common/InputHidable"
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty("Invalid password"),
});

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            // BACKEND API CALL HERE
            // ROUTING HERE IF LOGIN SUCCESSFULL
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    return (
            <Card className={cn("flex flex-col gap-6", className)} {...props}>
                <CardContent className="mt-4 font-paragraph">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                            {/*email field*/}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="example@example.com"
                                                id="email"
                                                type="email"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/*password field*/}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Password</FormLabel>
                                            <Button variant="link" size="tight" className="ml-auto">Forgot your password?</Button>
                                        </div>
                                        <FormControl>
                                            <InputHidable placeholder="********" placeholderVisible="abcdefgh" id="password" required={true} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/*submit button*/}
                            <Button type="submit" variant="gradient" className="w-full">
                                Log in
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
    );
}
