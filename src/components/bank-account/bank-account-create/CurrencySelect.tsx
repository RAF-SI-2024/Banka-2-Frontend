// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
// import { Label } from "@/components/ui/label.tsx";
// import {Currency} from "@/types/currency.ts";
// import {useState} from "react";
//
// // Definiši props tip
// interface CurrencySelectProps {
//     value: string;
//     onChange: (value: string) => void;
//     currencies: Currency[];
// }
//
//
// const CurrencySelect = ({ value, onChange, currencies }: CurrencySelectProps) => {
//     return (
//         <div className="flex flex-col space-y-1 w-full">
//             <Select value={value} onValueChange={onChange} >
//                 <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Izaberi valutu" />
//                 </SelectTrigger>
//                 <SelectContent side="bottom" >
//                     {currencies.map((currency: Currency) => {
//                         //Ako su code i symbol drugaciji prikazi oba (npr. USD - $)
//                         // ovo je zato sto neke valute imaju isti code i symbol
//                         const currencyLabel = currency.code === currency.symbol ? currency.code : `${currency.code} - ${currency.symbol}`;
//                         return (
//                             <SelectItem key={currency.id} value={`${currency.code} - ${currency.symbol}`} >
//                                 {currencyLabel}
//                             </SelectItem>
//                         );
//                     })}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };
//
// export default CurrencySelect;


import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { useEffect, useState } from "react";
import { Currency } from "@/types/bank_user/currency.ts";

// Definiši props tip
interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    currencies: Currency[];
}

const CurrencySelect = ({ value, onChange, currencies }: CurrencySelectProps) => {
    const [defaultCurrency, setDefaultCurrency] = useState<string>(value);

    // Postavi podrazumevanu valutu ako trenutna vrednost nije validna
    useEffect(() => {
        if (currencies.length > 0) {
            const existingCurrency = currencies.find(currency => `${currency.code} - ${currency.symbol}` === value);
            if (existingCurrency) {
                setDefaultCurrency(`${existingCurrency.code} - ${existingCurrency.symbol}`);
            } else {
                // Ako trenutna vrednost nije validna, postavi prvu valutu iz liste
                const firstCurrency = currencies[0];
                const formattedValue = `${firstCurrency.code} - ${firstCurrency.symbol}`;
                setDefaultCurrency(formattedValue);
                onChange(formattedValue);
            }
        }
    }, [currencies, value, onChange]);
    

    // Filter out 'RSD' currency
    const filteredCurrencies = currencies.filter(currency => currency.code !== 'RSD');

    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={defaultCurrency}  onValueChange={(selectedValue) => {
                setDefaultCurrency(selectedValue);
                onChange(selectedValue);
            }}>
                <SelectTrigger data-cy="currency-select" className="w-full">
                    <SelectValue>{defaultCurrency || "Izaberi valutu"}</SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom">
                    {filteredCurrencies.map((currency: Currency) => {
                        const currencyLabel = currency.code === currency.symbol ? currency.code : `${currency.code} - ${currency.symbol}`;
                        return (
                            <SelectItem key={currency.id} value={`${currency.code} - ${currency.symbol}`}>
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

