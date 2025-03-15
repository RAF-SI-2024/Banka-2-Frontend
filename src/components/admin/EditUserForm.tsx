import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {getUserById, updateClient, updateEmployee} from "@/api/user.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UpdateClientRequest, UpdateEmployeeRequest, User } from "@/types/user.ts";
import { createFormSchema, getFormFields } from "@/components/utils/form-fields.tsx";
import { FormFieldRenderer } from "@/components/admin/FormFieldRendered.tsx";
import {Role} from "@/types/enums.ts";
import {showErrorToast, showSuccessToast} from "@/utils/show-toast-utils.tsx";

interface EditFormProps extends React.ComponentProps<"div"> {
    id_: string;
    onClose: () => void;
}

export default function EditUserForm({ id_, className, onClose, ...props }: EditFormProps) {
    const [userData, setUserData] = useState<User | null>(null);
    const [formFields, setFormFields] = useState<any[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Create a type-safe form using a default schema initially
    const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(createFormSchema(Role.Client));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    // Watch form values to detect changes
    const watchedValues = form.watch();

    useEffect(() => {
        if (userData) {
            // Compare current form values with original data
            let formChanged = false;

            Object.keys(watchedValues).forEach(key => {
                if (watchedValues[key] !== userData[key as keyof typeof userData]) {
                    console.log("Form value changed:", key, watchedValues[key], userData[key as keyof typeof userData]);
                    formChanged = true;
                }
            });

            setHasChanges(formChanged);
            console.log("Form has changes:", formChanged);
        }
    }, [watchedValues, userData]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const user = await getUserById(id_);
                setUserData(user);
                const userRole = user.role;

                setFormSchema(createFormSchema(userRole));
                setFormFields(getFormFields(userRole));

                const formDefaultValues: any = {};

                if (userRole === Role.Client) {
                    formDefaultValues.firstName = user.firstName;
                    formDefaultValues.lastName = user.lastName;
                    formDefaultValues.phoneNumber = user.phoneNumber;
                    formDefaultValues.address = user.address;
                    formDefaultValues.activated = user.activated;
                } else {
                    formDefaultValues.firstName = user.firstName;
                    formDefaultValues.lastName = user.lastName;
                    formDefaultValues.username = (user as any).username;
                    formDefaultValues.phoneNumber = user.phoneNumber;
                    formDefaultValues.address = user.address;
                    formDefaultValues.role = userRole
                    formDefaultValues.department = (user as any).department;
                    formDefaultValues.activated = user.activated;
                }
                form.reset(formDefaultValues);
            } catch (error) {
                console.error("❌ Failed to fetch user data:", error);
                showErrorToast({error, defaultMessage: "Error fetching user data"});
            }
        }

        fetchUserData();
    }, [id_, form]);

    const mapToUpdateClientRequest = (values: any): UpdateClientRequest => {
        return {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            address: values.address,
            activated: values.activated,
        };
    };

    const mapToUpdateEmployeeRequest = (values: any): UpdateEmployeeRequest => {
        return {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            phoneNumber: values.phoneNumber,
            address: values.address,
            role: values.role,
            department: values.department,
            employed: values.employed,
            activated: values.activated,
        };
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (!userData) {
            showErrorToast({defaultMessage: "Could not update user. The original data is missing."})
            return;
        }

        if (!hasChanges) {
            console.log("Nothing has changed");
            onClose();
            return;
        }

        const updatedValues = {
            ...values,
            employed: true
        };

        try {

            let response;

            if (userData.role === Role.Client) {
                const updatedClient = mapToUpdateClientRequest(updatedValues);
                response = await updateClient(updatedClient, userData.id);
            } else {
                const updatedUser = mapToUpdateEmployeeRequest(updatedValues);
                response = await updateEmployee(updatedUser, userData.id);
            }
            if (response.success) {

                onClose();
                showSuccessToast({title: "Edit successful", description: "Successfully updated user data"});
                return;
            } else {
                throw new Error("Error updating user data");
            }
        } catch (error) {
            console.error("❌ Update failed:", error);
            showErrorToast({error, defaultMessage: "Error updating user data"});
        }
    }



    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        {['firstName', 'lastName', 'username', 'phoneNumber'].map((name) => {
                            const field = formFields.find(f => f.name === name);
                            return field ? (
                                <FormFieldRenderer key={name} field={field} control={form.control} />
                            ) : null;
                        })}
                    </div>

                    {(() => {
                        const field = formFields.find(f => f.name === 'address');
                        return field ? (
                            <FormFieldRenderer field={field} control={form.control} />
                        ) : null;
                    })()}

                    <div className="grid grid-cols-2 gap-4">
                        {['role', 'department', 'activated'].map((name) => {
                            const field = formFields.find(f => f.name === name);
                            return field ? (
                                <FormFieldRenderer key={name} field={field} control={form.control} />
                            ) : null;
                        })}
                    </div>


                    <Button
                        type="submit"
                        variant="gradient"
                        className="w-full"
                        disabled={!hasChanges}
                    >
                        Update
                    </Button>
                </form>
            </Form>
        </div>
    );
}
