
import { useState, useRef, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ActivityCodeDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ActivityCodeDropdown({ value, onChange }: ActivityCodeDropdownProps) {
    const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isInputEmpty, setIsInputEmpty] = useState(true); // State to track if the input is empty
    const [isInputFocused, setIsInputFocused] = useState(false); // Track if the input is focused

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setIsInputEmpty(newValue === ""); // Update state based on input content
        setFilteredOptions(
            options.filter((option) =>
                option.toLowerCase().includes(newValue.toLowerCase())
            )
        );
    };

    const handleOptionClick = (option: string) => {
        onChange(option);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <DropdownMenu>
                <div className="flex items-center border border-[var(--border)] rounded-lg px-3 h-10 bg-[var(--card)]">
                    <input
                        type="text"
                        placeholder="Enter activity code..."
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => setIsInputFocused(true)} // Set focused to true when the input is focused
                        onBlur={() => setIsInputFocused(false)} // Set focused to false when the input is blurred
                        className="w-full border-none outline-none bg-transparent text-white h-full placeholder-muted-foreground/50"
                    />
                    <DropdownMenuTrigger asChild>
                        {!isInputFocused && isInputEmpty && ( // Only show the arrow if the input is not focused and is empty
                            <button className="h-full px-2">
                                <span className="icon-[ph--arrow-down-bold]" />
                            </button>
                        )}
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg mt-1 shadow-lg z-10">
                    {filteredOptions.map((option, index) => (
                        <DropdownMenuItem
                            key={index}
                            className="p-2 cursor-pointer hover:bg-[var(--border)] text-white"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}