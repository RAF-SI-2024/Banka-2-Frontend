import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";

export interface Currency {
    name: string;
    symbol: string;
    isAfter: boolean;
}

const currencies: Currency[] = [
    {
        name: "RSD",
        symbol: "RSD",
        isAfter: true,
    },
    {
        name: "USD",
        symbol: "$",
        isAfter: false,
    },
    {
        name: "EUR",
        symbol: "€",
        isAfter: false,
    },
];

const mockRates: Record<string, number> = {
    'RSD-USD': 0.0091,
    'USD-RSD': 110,
    'RSD-EUR': 0.0085,
    'EUR-RSD': 117.65,
    'USD-EUR': 0.93,
    'EUR-USD': 1.07,
};

const convertCurrency = (from: Currency, to: Currency, amount: number): number => {
    const key = `${from.name}-${to.name}`;
    const rate = mockRates[key] || 1;
    return amount * rate;
};

const ConverterCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [currency1, setCurrency1] = useState<Currency>(currencies[0]);
    const [currency2, setCurrency2] = useState<Currency>(currencies[1]);
    const [amount1, setAmount1] = useState(100);
    const [amount2, setAmount2] = useState(0);

    useEffect(() => {
        function init() {
            handleAmount1Change(`${amount1}`);
        }
        init();
    }, []);


    function handleAmount1Change(val:string) {
        console.log("A1");
        const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));

        setAmount2(convertCurrency(currency1, currency2, numericValue));
        setAmount1(numericValue);
    }

    function handleCurrency1Change(val: string) {
        console.log("C1");
        const selectedCurrency = currencies.find(c => c.name === val);
        if (!selectedCurrency) return;

        setAmount2(convertCurrency(selectedCurrency, currency2, amount1));
        setCurrency1(selectedCurrency);
    }

    function handleAmount2Change(val:string) {
        console.log("A2");
        const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));
        setAmount1(convertCurrency(currency2, currency1, numericValue));
        setAmount2(numericValue);
    }

    function handleCurrency2Change(val:string) {
        console.log("C2");
        const selectedCurrency = currencies.find(c => c.name === val);
        if (!selectedCurrency) return;

        setAmount1(convertCurrency(selectedCurrency, currency1, amount2));
        setCurrency2(selectedCurrency);
    }

    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Currency converter</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between font-paragraph">
                <div>
                    <div className="w-20">
                        <Select value={currency1.name} onValueChange={val => handleCurrency1Change(val)}>
                            <SelectTrigger>
                                <SelectValue >{currency1.name}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem
                                        key={item.name}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency1"
                        value={amount1}
                        onChange={e => handleAmount1Change(e.target.value)}
                        currency={currency1.name}
                        decimalScale={2}
                    />
                </div>

                <div className="m-4 lg:pt-10 ">
                    <Button size="icon" className="text-primary hover:text-primary/50 cursor-auto" variant="ghost">
                        <span className="text-primary hover:text-primary/50 icon-[ph--equals] size-full"></span>
                    </Button>
                </div>

                <div className="flex flex-col">
                    <div className="w-20">
                        <Select value={currency2.name} onValueChange={val => handleCurrency2Change(val)}>
                            <SelectTrigger>
                                <SelectValue>{currency2.name}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem
                                        key={item.name}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency2"
                        value={amount2}
                        onChange={e => handleAmount2Change(e.target.value)}
                        currency={currency2.name}
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