// RadioGroupSelector.tsx
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import { RadioGroupItem } from "@/components/ui/radio-group.tsx"; // Ako je ovo odvojeno
import { Label } from "@/components/ui/label.tsx"; // Pretpostavljam da je Label komponenta takođe u tvojoj aplikaciji

interface RadioGroupSelectorProps {
    selectedOption: string;
    setSelectedOption: (value: string) => void;
}

const RadioGroupSelector: React.FC<RadioGroupSelectorProps> = ({ selectedOption, setSelectedOption }) => {
    return (
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="mt-4 flex flex-row space-x-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem
                    value="new"
                    id="new"
                    className="border-white checked:bg-white"
                />
                <Label htmlFor="new">Register a new client account</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem
                    value="existing"
                    id="existing"
                    className="border-white checked:bg-white"
                />
                <Label htmlFor="existing">Use an existing one</Label>
            </div>
        </RadioGroup>
    );
};

export default RadioGroupSelector;
