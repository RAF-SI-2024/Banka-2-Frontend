import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import {Currency} from "@/types/currency.ts";

// Definiši props tip
interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    currencies: Currency[];
}


const CurrencySelect = ({ value, onChange, currencies }: CurrencySelectProps) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={value} onValueChange={onChange} >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberi valutu" />
                </SelectTrigger>
                <SelectContent side="bottom" >
                    {currencies.map((currency: Currency) => {
                        //Ako su code i symbol drugaciji prikazi oba (npr. USD - $)
                        // ovo je zato sto neke valute imaju isti code i symbol
                        const currencyLabel = currency.code === currency.symbol ? currency.code : `${currency.code} - ${currency.symbol}`;
                        return (
                            <SelectItem key={currency.id} value={`${currency.code} - ${currency.symbol}`} >
                                {currencyLabel}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};

export default CurrencySelect;
