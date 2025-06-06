import React, {useEffect, useState} from "react";
import {Actuary, EditActuaryRequest, Permission} from "@/types/bank_user/actuary.ts";
import {Role, User} from "@/types/bank_user/user.ts"; // Dodaj definisane role
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import MoneyInput from "@/components/__common__/input/MoneyInput";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const adminSchema = z.object({
  permission: z.string(),
  accountLimit: z.number().gt(0, "Limit must be greater than zero"),
});


const employeeSchema = z.object({
  permission: z.string(),
  accountLimit: z.number().gt(0, "Limit must be greater than zero"),
});

type FormValues = z.infer<typeof adminSchema> | z.infer<typeof employeeSchema>;

interface EditActuaryFormProps {
  actuary: Actuary;
  onClose: () => void;
  onEditActuary: (oldValue: Actuary, req: EditActuaryRequest) => void;
}

export default function EditActuaryForm({
  actuary,
  onClose,
                                          onEditActuary,
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
      permission:  actuary.permission.toString(),
      accountLimit: actuary.account.monthlyLimit,
    }
  });

  useEffect(() => {
    console.log("📌 Current actuary:", actuary); // Loguje trenutni actuary

    form.reset({
      permission: actuary.permission.toString(),
      accountLimit: actuary.account.monthlyLimit,
    });
    setActuaryType(actuary.permission);
  }, [actuary, isAdmin, form]);

  const { control, handleSubmit, watch } = form;
  const hasChanges =
    watch("accountLimit") !== actuary.account.monthlyLimit ||
    (isAdmin && watch("permission") !== actuary.permission.toString());

  const onSubmit = async (values: FormValues) => {
    try {
      let payload;

      if(isAdmin){
        payload = {
          id: actuary.id,
          accountId: actuary.account.id,
          permission: Number(values.permission),
          accountLimit: values.accountLimit,
        }
      }
      else {
        payload = {
          id: actuary.id,
          accountId: actuary.account.id,
          permission: Number(actuary.permission),
          accountLimit: values.accountLimit,
        }
      }
      // const updatedActuary = { ...actuary, ...payload };
      // console.log("🚀 Updated actuary:", updatedActuary);
      // showSuccessToast({ title: "Updated successfully" });
      onClose();
      // onSuccess(updatedActuary); // Pass the updated actuary to onSuccess

      onEditActuary(actuary, payload);
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
            key="permission"
            name="permission"
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
          key="accountLimit"
          name="accountLimit"
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
                  defaultValue={actuary.account.monthlyLimit}
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
