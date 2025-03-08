import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";


interface TypeSelectProps {
    type: string;
    setType: (value: string) => void;
}

const TypeSelect = ({ type, setType }: TypeSelectProps) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue placeholder="Izaberi tip" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Current Account">Current Account</SelectItem>
                    <SelectItem value="Foreign Exchange Account">Foreign Exchange Account</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default TypeSelect;
