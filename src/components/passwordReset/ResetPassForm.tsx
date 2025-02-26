import * as React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import InputHidable from "@/components/common/InputHidable.tsx";

const data = [
    // {
    //     checked: true,
    //     label: "Email",
    //     name: "email",
    //     placeholder: "example@example.com",
    //     required: true,
    //     type: "email",
    //     variant: "Input"
    // },
    {
        checked: true,
        label: "Password",
        name: "password",
        placeholder: "********",
        placeholderVisible: "abcdefgh",
        required: true,
        type: "password",
        // variant: "Password"
    }
];

const formSchema = z.object({
    // TODO? password (?? enough characters or big letter)
});

export default function ResetPassForm({ className, ...props }: React.ComponentProps<"div">) {


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
                            {data.map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name}
                                    render={({ field: fieldProps }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel>Enter New Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <InputHidable
                                                    placeholder={field.placeholder}
                                                    placeholderVisible={field.placeholderVisible}
                                                    id={field.name}
                                                    {...fieldProps}
                                                />
                                            </FormControl>
                                            <div className="flex items-center">
                                                <FormLabel>Confirm Password</FormLabel>
                                            </div>
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
                                    )}></FormField>
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