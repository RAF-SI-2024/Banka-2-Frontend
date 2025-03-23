import { Input } from "@/components/ui/input.tsx"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage, FormDescription
} from "@/components/ui/form.tsx"
import { Button } from "@/components/ui/button.tsx"
import * as React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Template} from "@/types/templates.ts";

interface RecipientInputProps {
    templates: Template[]
}

export function RecipientInput({ templates }: RecipientInputProps) {

    const [open, setOpen] = React.useState(false)


    return (
        <FormField
            key="recipientAccount"
            name="recipientAccount"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>Recipient account</FormLabel>
                    <FormControl>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" data-cy="recipient-dropdown" aria-expanded={open} className="justify-between hover:bg-foreground/80 text-muted-foreground border-border">
                                    {field.value || "Enter account number..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0">
                                <Command>
                                    <Input
                                        placeholder="123-4567890123456-89"
                                        {...field}
                                        className="pr-10 border-0 ring-0 rounded-none"
                                        maxLength={18}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No options found.</CommandEmpty>
                                        <CommandGroup>
                                            {templates.map((template, index) => (
                                                <CommandItem
                                                    key={index}
                                                    value={template.accountNumber}
                                                    onSelect={(currentValue) => {
                                                        field.onChange(currentValue === field.value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {template.name} ({template.accountNumber})
                                                    <Check className={field.value === template ? "ml-auto opacity-100" : "ml-auto opacity-0"} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormDescription>
                        To account
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
