import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";

// Definiši props tip
interface CurrencySelectProps {
    selectedCurrency: string;
    setSelectedCurrency: (value: string) => void;
}


const CurrencySelect = ({ selectedCurrency, setSelectedCurrency }: CurrencySelectProps) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberi valutu" />
                </SelectTrigger>
                <SelectContent side="bottom">
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default CurrencySelect;
