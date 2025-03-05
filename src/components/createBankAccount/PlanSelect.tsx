// PlanSelect.tsx
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Prilagodi import prema tvojoj strukturi
import { Label } from "@/components/ui/label"; // Ako koristiš Label komponentu iz svog UI paketa

interface PlanSelectProps {
    plan: string;
    handlePlanChange: (value: string) => void;
    ownership: string;
}

const PlanSelect: React.FC<PlanSelectProps> = ({ plan, handlePlanChange, ownership }) => {
    return (
        <div className="w-full">
            <Label className="text-white text-left">Plan</Label>
            <Select value={plan} onValueChange={handlePlanChange}>
                <SelectTrigger className="w-full p-2 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue placeholder="Izaberi plan" />
                </SelectTrigger>
                <SelectContent>
                    {ownership === "Business" ? (
                        <>
                            <SelectItem value="DOO">DOO</SelectItem>
                            <SelectItem value="AD">AD</SelectItem>
                            <SelectItem value="Fondacija">Fondacija</SelectItem>
                        </>
                    ) : (
                        <>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Pensioners">Pensioners</SelectItem>
                            <SelectItem value="Youth">Youth</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Unemployed">Unemployed</SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PlanSelect;
