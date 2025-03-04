import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ActivityCodeDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ActivityCodeDropdown({
                                                 value,
                                                 onChange,
                                             }: ActivityCodeDropdownProps) {
    const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setFilteredOptions(
            options.filter((option) =>
                option.toLowerCase().includes(newValue.toLowerCase())
            )
        );
        setShowDropdown(true);
    };

    const handleOptionClick = (option: string) => {
        onChange(option);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="flex items-center border border-[var(--border)] rounded-lg px-3 h-10 bg-[var(--card)]">
                <Input
                    type="text"
                    placeholder="You can search by typing..."
                    value={value}
                    onChange={handleInputChange}
                    className="w-full border-none outline-none outline-transparent bg-transparent text-white h-full"
                />
                <Button variant="ghost" size="icon" onClick={toggleDropdown} className="h-full">
                    <span className="icon-[ph--arrow-down-bold]" />
                </Button>
            </div>

            {showDropdown && (
                <ul className="absolute w-full bg-[var(--card)] border border-[var(--border)] rounded-lg mt-1 shadow-lg z-10">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-[var(--border)] text-white"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No options found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
