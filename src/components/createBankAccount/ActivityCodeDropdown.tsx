import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ActivityCodeDropdownProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function ActivityCodeDropdown({ className, value, onChange }: ActivityCodeDropdownProps) {
    const [open, setOpen] = React.useState(false)
    const [filteredOptions, setFilteredOptions] = React.useState(["Option 1", "Option 2", "Option 3"])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)
        setFilteredOptions(
            ["Option 1", "Option 2", "Option 3"].filter(option =>
                option.toLowerCase().includes(newValue.toLowerCase())
            )
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[446px] justify-between">
                    {value || "Enter activity code..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[446px] p-0">
                <Command>
                    <CommandInput placeholder="Search activity code..." className="h-9">
                        <input type="text" onChange={handleInputChange} />
                    </CommandInput>
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option, index) => (
                                <CommandItem
                                    key={index}
                                    value={option}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {option}
                                    <Check className={value === option ? "ml-auto opacity-100" : "ml-auto opacity-0"} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}