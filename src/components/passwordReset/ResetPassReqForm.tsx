import {Card, CardContent} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import * as React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


// const data = [
//     {
//         checked: true,
//         label: "Email",
//         name: "email",
//         placeholder: "example@example.com",
//         required: true,
//         type: "email",
//     }
// ];

const formSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required")
});

export default function ResetPassReqForm({ className, ...props }: React.ComponentProps<"div">) {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

return (
    <div className="flex flex-col gap-2">
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
            <CardContent className="mt-4 font-paragraph">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center">
                                        <FormLabel>
                                            Enter the email you use to access your BankToo account and we will send you a link for password change.
                                        </FormLabel>
                                    </div>
                                    <div className="flex items-center">
                                        <FormLabel>Email</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="example@example.com"
                                            type="email"
                                            id="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="gradient" className="w-full">
                            Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

    </div>
);
}