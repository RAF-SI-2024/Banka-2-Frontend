import { useEffect, useState } from "react";
import { Actuary, ActuaryType } from "@/types/actuary";
import { Role } from "@/types/user"; // Dodaj definisane role
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MoneyInput from "@/components/__common__/input/MoneyInput";
import { showErrorToast, showSuccessToast } from "@/lib/show-toast-utils";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const adminSchema = z.object({
  actuaryType: z.nativeEnum(ActuaryType),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isAdmin
      ? { actuaryType: actuary.actuaryType, limit: actuary.limit }
      : { limit: actuary.limit },
  });

  useEffect(() => {
    console.log("📌 Current actuary:", actuary); // Loguje trenutni actuary

    form.reset({
      actuaryType: isAdmin ? actuary.actuaryType : undefined,
      limit: actuary.limit,
    });
  }, [actuary, isAdmin, form]);

  const { control, handleSubmit, watch } = form;
  const hasChanges =
    watch("limit") !== actuary.limit ||
    (isAdmin && watch("actuaryType") !== actuary.actuaryType);

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedActuary = { ...actuary, ...values };
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
            name="actuaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actuary Type</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {Object.keys(ActuaryType).find(
                          (key) =>
                            ActuaryType[key as keyof typeof ActuaryType] ===
                            field.value
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(ActuaryType)
                      .filter((key) => isNaN(Number(key))) // Zadrži samo stringove
                      .map((key) => (
                        <SelectItem
                          key={key}
                          value={String(
                            ActuaryType[key as keyof typeof ActuaryType]
                          )}
                        >
                          {key}
                        </SelectItem>
                      ))}
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
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <MoneyInput
                  currency={"RSD"}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    const numericValue = Number(
                      rawValue.replace(/\./g, "").replace(",", ".")
                    );
                    field.onChange(numericValue);
                  }}
                  defaultValue={0}
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
