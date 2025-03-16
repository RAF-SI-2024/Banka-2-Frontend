// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
// import { cn } from "@/lib/utils.ts";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import MoneyInput from "@/components/common/input/MoneyInput.tsx";
// import { getExchangeRate, getAllCurrencies } from "@/api/currency.ts";
// import { Currency } from "@/types/currency.ts";
//
//
// const ConverterCard = ({ className, ...props }: React.ComponentProps<"div">) => {
//     const [currencies, setCurrencies] = useState<Currency[]>([]);
//     const [currency1, setCurrency1] = useState<Currency | null>(null);
//     const [currency2, setCurrency2] = useState<Currency | null>(null);
//     const [amount1, setAmount1] = useState(100);
//     const [amount2, setAmount2] = useState(0);
//     const [rate, setRate] = useState(1);
//
//     // Dohvati sve valute iz baze
//     useEffect(() => {
//         const fetchCurrencies = async () => {
//             try {
//                 const data = await getAllCurrencies();
//                 console.log("📢 Fetched currencies:", data); // PROVERI API RESPONSE
//
//                 if (data.length >= 2) {
//                     setCurrencies(data);
//                     setCurrency1(data[0]); // Prva valuta
//                     setCurrency2(data[1]); // Druga valuta
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching currencies:", error);
//             }
//         };
//
//         fetchCurrencies();
//     }, []);
//
//     // Dohvati exchange rate
//     const updateExchangeRate = async () => {
//         if (!currency1 || !currency2) return;
//
//         try {
//             const data = await getExchangeRate(currency1.code, currency2.code);
//             setRate(data.rate);
//             setAmount2(amount1 * data.rate);
//         } catch (error) {
//             console.error("❌ Error fetching exchange rate:", error);
//         }
//     };
//
//     // Pokreni update pri učitavanju i na svake 3 sekunde
//     useEffect(() => {
//         updateExchangeRate();
//         const interval = setInterval(() => updateExchangeRate(), 3000);
//         return () => clearInterval(interval);
//     }, [currency1, currency2]);
//
//     const handleAmount1Change = (val: string) => {
//         const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));
//         setAmount1(numericValue);
//     };
//
//     const handleCurrencyChange = (val: string, setCurrency: (currency: Currency) => void) => {
//         const selectedCurrency = currencies.find((c) => c.code === val);
//         if (selectedCurrency) setCurrency(selectedCurrency);
//     };
//
//     return (
//         <Card className={cn("border-0 content-center", className)} {...props}>
//             <CardHeader>
//                 <CardTitle className="font-heading text-2xl">Currency Converter</CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between font-paragraph">
//                 <div>
//                     <div className="w-20">
//                         <Select
//                             value={currency1?.code || ""}
//                             onValueChange={(val) => handleCurrencyChange(val, setCurrency1)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue>{currency1?.code || "Select"}</SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {currencies.map((item) => (
//                                     <SelectItem key={item.code} value={item.code}>
//                                         {item.code} ({item.symbol})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <MoneyInput
//                         id="currency1"
//                         value={amount1}
//                         onChange={(e) => handleAmount1Change(e.target.value)}
//                         currency={currency1?.code ?? "USD"} // ✅ Koristi `code`
//                         decimalScale={2}
//                     />
//                 </div>
//
//                 <div className="m-4 lg:pt-10">
//                     <Button size="icon" className="text-primary hover:text-primary/50 cursor-auto" variant="ghost">
//                         <span className="text-primary hover:text-primary/50 icon-[ph--equals] size-full"></span>
//                     </Button>
//                 </div>
//
//                 <div className="flex flex-col">
//                     <div className="w-20">
//                         <Select
//                             value={currency2?.code || ""}
//                             onValueChange={(val) => handleCurrencyChange(val, setCurrency2)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue>{currency2?.code || "Select"}</SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {currencies.map((item) => (
//                                     <SelectItem key={item.code} value={item.code}>
//                                         {item.code} ({item.symbol})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <MoneyInput
//                         id="currency2"
//                         value={amount2}
//                         onChange={(e) => setAmount2(parseFloat(e.target.value))}
//                         currency={currency2?.code ?? "USD"} // ✅ Koristi `code`
//                     />
//                 </div>
//             </CardContent>
//             <CardFooter className="w-full justify-center">
//                 <CardDescription>Convert between currencies with real-time exchange rates.</CardDescription>
//             </CardFooter>
//         </Card>
//     );
// };
//
// export default ConverterCard;
//

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";
import { getExchangeRate, getAllCurrencies } from "@/api/currency.ts";
import { Currency } from "@/types/currency.ts";

const ConverterCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currency1, setCurrency1] = useState<Currency | null>(null);
    const [currency2, setCurrency2] = useState<Currency | null>(null);
    const [amount1, setAmount1] = useState(100);
    const [amount2, setAmount2] = useState(0);
    const [rate, setRate] = useState(1);

    // Dohvati sve valute iz baze
    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await getAllCurrencies();
                console.log("📢 Fetched currencies:", data); // PROVERI API RESPONSE

                if (data.length >= 2) {
                    setCurrencies(data);
                    setCurrency1(data.find(c => c.code === "RSD") || data[0]); // Postavi RSD kao default
                    setCurrency2(data.find(c => c.code === "EUR") || data[1]); // Postavi EUR kao default
                }
            } catch (error) {
                console.error("❌ Error fetching currencies:", error);
            }
        };

        fetchCurrencies();
    }, []);

    // Dohvati exchange rate
    const updateExchangeRate = async () => {
        if (!currency1 || !currency2) return;

        try {
            const data = await getExchangeRate(currency1.code, currency2.code);
            setRate(data.rate);
            setAmount2(amount1 * data.rate);
        } catch (error) {
            console.error("❌ Error fetching exchange rate:", error);
        }
    };

    // Pokreni update pri učitavanju i na svake 3 sekunde
    useEffect(() => {
        updateExchangeRate();
        const interval = setInterval(() => updateExchangeRate(), 3000);
        return () => clearInterval(interval);
    }, [currency1, currency2]);

    const handleAmount1Change = (val: string) => {
        const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));
        setAmount1(numericValue);
    };

    const handleCurrencyChange = (val: string, setCurrency: (currency: Currency) => void) => {
        const selectedCurrency = currencies.find((c) => c.code === val);
        if (selectedCurrency) setCurrency(selectedCurrency);
    };

    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between font-paragraph">
                <div>
                    <div className="w-20">
                        <Select
                            value={currency1?.code || ""}
                            onValueChange={(val) => handleCurrencyChange(val, setCurrency1)}
                        >
                            <SelectTrigger>
                                <SelectValue>{currency1?.code || "Select"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem key={item.code} value={item.code}>
                                        {item.code} ({item.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency1"
                        value={amount1}
                        onChange={(e) => handleAmount1Change(e.target.value)}
                        currency={currency1?.code ?? "USD"} // ✅ Koristi `code`
                        decimalScale={2}
                    />
                </div>

                <div className="m-4 lg:pt-10">
                    <Button size="icon" className="text-primary hover:text-primary/50 cursor-auto" variant="ghost">
                        <span className="text-primary hover:text-primary/50 icon-[ph--equals] size-full"></span>
                    </Button>
                </div>

                <div className="flex flex-col">
                    <div className="w-20">
                        <Select
                            value={currency2?.code || ""}
                            onValueChange={(val) => handleCurrencyChange(val, setCurrency2)}
                        >
                            <SelectTrigger>
                                <SelectValue>{currency2?.code || "Select"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem key={item.code} value={item.code}>
                                        {item.code} ({item.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency2"
                        value={amount2}
                        onChange={(e) => setAmount2(parseFloat(e.target.value))}
                        currency={currency2?.code ?? "USD"} // ✅ Koristi `code`
                    />
                </div>
            </CardContent>
            <CardFooter className="w-full justify-center">
                <CardDescription>Convert between currencies with real-time exchange rates.</CardDescription>
            </CardFooter>
        </Card>
    );
};

export default ConverterCard;
