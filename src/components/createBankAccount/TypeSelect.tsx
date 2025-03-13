import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { useEffect } from "react";

interface TypeSelectProps {
    type: string;
    setType: (value: string) => void;
    accountTypes: any[];
}

const TypeSelect = ({ type, setType, accountTypes }: TypeSelectProps) => {
    const filteredAccountTypes = [
        { id: "1", name: "Current Account" },
        { id: "2", name: "Foreign Currency Account" }
    ]

    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={type} onValueChange={(value) => {
                    setType(value);
                }}>
                <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue placeholder="Izaberi tip" />
                </SelectTrigger>
                <SelectContent>
                    {filteredAccountTypes.map((accountType) => (
                        <SelectItem key={accountType.id} value={accountType.name}>
                            {accountType.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TypeSelect;









