import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { editUser } from "@/api/user.ts";
import { getUser } from "@/api/user.ts";
import { EditUserRequest, GetUserRequest } from "@/types/user.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputHidable from "@/components/common/InputHidable";
import { Card, CardContent } from "@/components/ui/card";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Form for separated field definitions
const data2 = [
    {
        checked: true,
        label: "First Name",
        name: "firstname",
        placeholder: "Jon",
        required: true,
        type: "firstname",
        variant: "Input",
        disabled: true
    },
    {
        checked: true,
        label: "Last Name",
        name: "lastname",
        placeholder: "Doe",
        required: true,
        type: "lastname",
        variant: "LastName"
    }
]

// Form field definitions
const data = [
    {
        checked: true,
        label: "Email",
        name: "email",
        placeholder: "example@example.com",
        required: true,
        type: "email",
        variant: "Input",
        disabled: true
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
    },
    {
        checked: true,
        label: "Date Of Birth",
        name: "dateofbirth",
        placeholder: "",
        required: true,
        type: "date",
        variant: "Date",
        disabled: true
    },
    {
        checked: true,
        label: "Gender",
        name: "gender",
        required: true,
        type: "gender",
        variant: "Gender"
    },
    {
        checked: true,
        label: "Unique Identification Number",
        name: "uniqueidentificationnumber",
        placeholder: "1234567890123",
        required: true,
        type: "uniqueidentificationnumber",
        variant: "Input",
        disabled: true
    },
    {
        checked: true,
        label: "Username",
        name: "username",
        placeholder: "username",
        required: true,
        type: "username",
        variant: "Input",
        disabled: true
    },
    {
        checked: true,
        label: "Phone Number",
        name: "phonenumber",
        placeholder: "+381",
        required: true,
        type: "phonenumber",
        variant: "PhoneNumber"
    },
    {
        checked: true,
        label: "Address",
        name: "address",
        placeholder: "123 Main St, City, Country",
        required: true,
        type: "address",
        variant: "Address"
    },
    {
        checked: true,
        label: "Department",
        name: "department",
        placeholder: "Department",
        required: true,
        type: "department",
        variant: "Input"
    },
    {
        checked: true,
        label: "User Role",
        name: "role",
        required: true,
        type: "role",
        variant: "Role"
    },
    {
        checked: true,
        label: "Are you currently employed?",
        name: "activated",
        required: true,
        type: "activated",
        variant: "Activated"
    } 
    
];

// Schema for validation
const formSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    date: z.coerce.date().refine((date) => date <= new Date(), {
        message: "Date must be today or in the past",
      }),
    gender: z.number(),
    uniqueidentificationnumber: z.string().min(13, "13 numbers are required"),
    username: z.string().min(1, "Username is required"),
    phonenumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    department: z.string().min(1, "Department is required"),
    role: z.number(),
    activated: z.boolean()
});

export default function EditUserForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Array<{ id: number; title:string, description: string }>>([]);
    const [userData, setUserData] = useState<any>(null); // Keeps user data until they are loaded

    useEffect(() => {
         const getData: GetUserRequest = { uniqueidentificationnumber: "1" };

         const fetchUserData = async () => {
             try {
                 const response = await getUser(getData);
                 setUserData(response);
                 form.reset({
                    firstname: response.firstname || "",
                    lastname: response.lastname || "",
                    email: response.email || "",
                    password: response.password || "",
                    date: response.date || new Date(),
                    gender: response.gender || 1,
                    uniqueidentificationnumber: response.uniqueidentificationnumber || "",
                    username: response.username || "",
                    phonenumber: response.phonenumber || "",
                    address: response.address || "",
                    department: response.department || "",
                    role: response.role || 1,
                    activated: response.activated || true})
             } catch (error) {
                 setErrors([{ id: 1, title: "Error", description: "Failed to fetch user data" }]);
             }
         };

         fetchUserData();
     }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange" // Default values in useEffect
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrors([]); // Clear errors on submit
        try {
            const editUserData: EditUserRequest = {
                firstname: values.firstname, 
                lastname: values.lastname,
                email: values.email, 
                password: values.password,
                date: values.date,
                gender: values.gender,
                uniqueidentificationnumber: values.uniqueidentificationnumber,
                username: values.username,
                phonenumber: values.phonenumber,
                address: values.address,
                department: values.department,
                role: values.role,
                activated: values.activated
            };
            const response = await editUser(editUserData);
            if (response.jwt) {
                navigate("/edituser", { replace: true });
            } else {
                setErrors(prev => [...prev, {
                    id: Date.now(),
                    title: "Failed to edit",
                    description: "Invalid credentials"
                }]);
            }
        } catch (error) {
            console.error("❌ Edit failed:", error);
            setErrors(prev => [...prev, {
                id: Date.now(),
                title: "Failed to edit",
                description: error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : String(error || "An error occurred"),

            }]);
        }
    }

    const removeError = (id: number) => {
        setErrors(prev => prev.filter(error => error.id !== id));
    };

    return (
        <div className="flex flex-col gap-2">
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
            <CardContent className="mt-4 font-paragraph">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex gap-4">
                        {data2.map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as "firstname" | "lastname"}
                                render={({ field: fieldProps }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>{field.label}</FormLabel>
                                        </div>
                                        <FormControl>
                                            {
                                                <Input disabled={field.disabled} id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} />
                                            }
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        </div>
                        {data.map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as "email" | "password" | "gender" | "uniqueidentificationnumber" | "username" | "phonenumber" |
                                    "address" | "department" | "role" }
                                render={({ field: fieldProps }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>{field.label}</FormLabel>
                                        </div>
                                        <FormControl>
                                            {field.variant === "Password" ? (
                                                <InputHidable
                                                    placeholder={field.placeholder}
                                                    placeholderVisible={field.placeholderVisible}
                                                    id={field.name}
                                                    {...fieldProps}
                                                />
                                            ): field.variant === "PhoneNumber" ? (
                                                <Input id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} />
                                            ): field.variant === "Gender" ? (
                                                // <RadioGroup defaultValue= {form.control._reset.gender?.toString()} className="flex gap-4">
                                                <RadioGroup defaultValue={userData?.gender?.toString() || "1"} className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="male" />
                                                    <Label htmlFor="male">Male</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="female" />
                                                    <Label htmlFor="female">Female</Label>
                                                </div>
                                                </RadioGroup>
                                            ): field.variant === "Role" ? (
                                                <RadioGroup defaultValue= {form.control._defaultValues.role?.toString() || "1"} className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="admin" />
                                                    <Label htmlFor="admin">Admin</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="employee" />
                                                    <Label htmlFor="employee">Employee</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="3" id="client" />
                                                    <Label htmlFor="client">Client</Label>
                                                </div>
                                                </RadioGroup>
                                            ): field.variant === "Activated" ? (
                                                <RadioGroup defaultValue= {form.control._defaultValues.activated?"1":"2"} className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="activated" />
                                                    <Label htmlFor="activated">Activated</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="deactivated" />
                                                    <Label htmlFor="deactivated">Deactivated</Label>
                                                </div>
                                                </RadioGroup>
                                            ): 
                                            (
                                                <Input disabled={field.disabled} id={field.name} type={field.type} placeholder={field.placeholder} {...fieldProps} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="submit" variant="gradient" className="w-full">
                            Confirm Changes
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
    );
}
