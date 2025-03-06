import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";


interface OwnershipSelectProps {
    ownership: string;
    handleOwnershipChange: (value: string) => void;
}

const OwnershipSelect = ({ ownership, handleOwnershipChange }: OwnershipSelectProps) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <Label className="text-white text-left">Ownership</Label>
            <Select value={ownership} onValueChange={handleOwnershipChange}>
                <SelectTrigger className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue placeholder="Choose ownership" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default OwnershipSelect;
