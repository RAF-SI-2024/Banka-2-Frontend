import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface FormFieldProps {
    field: {
        name: string;
        label: string;
        placeholder: string;
        type: string;
        variant: string;
        required: boolean;
        options?: Array<{ value: string; label: string; }>;
    };
    control: Control<any>;
}

export const FormFieldRenderer: React.FC<FormFieldProps> = ({ field, control }) => {
    switch (field.variant) {
        case "Input":
            return (
                <FormField
                    key={field.name}
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                                <Input 
                                    id={field.name} 
                                    type={field.type} 
                                    placeholder={field.placeholder} 
                                    {...fieldProps} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        
        case "Select":
            return (
                <FormField
                    key={field.name}
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => {
                        // Since options are strings ("0", "1"), but form stores numbers (0, 1),
                        // we need to match by converting to number
                        const selectedOption = field.options?.find(option => Number(option.value) === fieldProps.value);

                        return (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <Select
                                    onValueChange={(val) => fieldProps.onChange(Number(val))} // Convert selected string to number
                                    value={String(fieldProps.value)} // Ensure the select displays correct value
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={field.placeholder}>
                                                {selectedOption?.label || field.placeholder}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-card">
                                        {field.options?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

            );
        
        case "Checkbox":
            return (
                <FormField
                    key={field.name}
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                            <FormControl>
                                <Checkbox
                                    checked={fieldProps.value}
                                    onCheckedChange={fieldProps.onChange}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{field.label}</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        
        case "DatePicker":
            return (
                <FormField
                    key={field.name}
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !fieldProps.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {fieldProps.value ? (
                                                format(new Date(fieldProps.value), "PPP")
                                            ) : (
                                                <span>{field.placeholder}</span>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={fieldProps.value ? new Date(fieldProps.value) : undefined}
                                        onSelect={(date) => fieldProps.onChange(date?.toISOString())}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        
        default:
            return null;
    }
};