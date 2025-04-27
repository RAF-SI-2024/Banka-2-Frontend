import React, {useEffect, useState} from "react";
import {Actuary, Permission} from "@/types/bank_user/actuary.ts";
import {Role} from "@/types/bank_user/user.ts"; // Dodaj definisane role
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import MoneyInput from "@/components/__common__/input/MoneyInput";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const adminSchema = z.object({
  actuaryType: z.string(),
  limit: z.number().gt(0, "Limit must be greater than zero"),
});

const employeeSchema = z.object({
  limit: z.number().gt(0, "Limit must be greater than zero"),
});

type FormValues = z.infer<typeof adminSchema> | z.infer<typeof employeeSchema>;

interface EditActuaryFormProps {
  actuary: Actuary;
  onClose: () => void;
  onSuccess: (updatedActuary: Actuary) => void;
}

export default function EditActuaryForm({
  actuary,
  onClose,
  onSuccess,
}: EditActuaryFormProps) {
  const [currentUserRole, setCurrentUserRole] = useState<Role>(Role.Invalid);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user !== null) {
      const parsedUser = JSON.parse(user);
      setCurrentUserRole(parsedUser.role);
    }
  }, []);

  const isAdmin = currentUserRole === Role.Admin;
  const schema = isAdmin ? adminSchema : employeeSchema;

  const [actuaryType, setActuaryType] = useState<Permission>();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      actuaryType:  actuary.actuaryType.toString(),
      limit: actuary.limit,
    }
  });

  useEffect(() => {
    console.log("📌 Current actuary:", actuary); // Loguje trenutni actuary

    form.reset({
      actuaryType: actuary.actuaryType.toString(),
      limit: actuary.limit,
    });
    setActuaryType(actuary.actuaryType);
  }, [actuary, isAdmin, form]);

  const { control, handleSubmit, watch } = form;
  const hasChanges =
    watch("limit") !== actuary.limit ||
    (isAdmin && watch("actuaryType") !== actuary.actuaryType.toString());

  const onSubmit = async (values: FormValues) => {
    try {
      let payload;

      if(isAdmin){
        payload = {
          actuaryType: Number(actuary.actuaryType),
          limit: actuary.limit,
        }
      }
      else {
        payload = {
          limit: actuary.limit,
        }
      }
      const updatedActuary = { ...actuary, ...payload };
      console.log("🚀 Updated actuary:", updatedActuary);
      showSuccessToast({ title: "Updated successfully" });
      onClose();
      onSuccess(updatedActuary); // Pass the updated actuary to onSuccess
    } catch (error) {
      console.error("❌ Update failed:", error);
      showErrorToast({ error, defaultMessage: "Failed to update actuary" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {isAdmin && (
          <FormField
            control={control}
            key="actuaryType"
            name="actuaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actuary Type</FormLabel>
                <Select
                    {...field}
                  onValueChange={value => {
                    setActuaryType(Number(value));
                    field.onChange(value);
                  }
                }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Permission.Employee.toString()}>
                      None
                    </SelectItem>
                    <SelectItem value={Permission.Supervisor.toString()}>
                      Supervisor
                    </SelectItem>
                    <SelectItem value={Permission.Agent.toString()}>
                      Agent
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={actuaryType !== Permission.Agent ? "text-muted-foreground": ""}>Limit</FormLabel>
              <FormControl>
                <MoneyInput
                  disabled={actuaryType !== Permission.Agent}
                  currency={"RSD"}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    const numericValue = Number(
                      rawValue.replace(/\./g, "").replace(",", ".")
                    );
                    field.onChange(numericValue);
                  }}
                  defaultValue={actuary.limit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="gradient" disabled={!hasChanges}>
          Update
        </Button>
      </form>
    </Form>
  );
}
