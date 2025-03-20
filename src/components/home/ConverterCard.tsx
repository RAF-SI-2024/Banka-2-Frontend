import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MoneyInput from "@/components/common/input/MoneyInput.tsx";
import { getExchangeRate, getAllCurrencies } from "@/api/currency.ts";
import { Currency } from "@/types/currency.ts";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {useNavigate} from "react-router-dom";

const ConverterCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currency1, setCurrency1] = useState<Currency | null>(null);
    const [currency2, setCurrency2] = useState<Currency | null>(null);
    const [amount1, setAmount1] = useState(100);
    const [amount2, setAmount2] = useState(0);
    const [rate, setRate] = useState(1);
    const [initRate, setInitRate] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await getAllCurrencies();

                const uniqueCurrencies = data.filter(
                    (c: Currency, index: number, self: Currency[]) =>
                        self.findIndex((el: Currency) => el.code === c.code) === index
                );

                if (uniqueCurrencies.length >= 2) {
                    setCurrencies(uniqueCurrencies);
                    const defaultCurrency1 = uniqueCurrencies.find((c: Currency) => c.code === "RSD") || uniqueCurrencies[0];
                    const defaultCurrency2 = uniqueCurrencies.find((c: Currency) => c.code === "EUR") || uniqueCurrencies[1];

                    setCurrency1(defaultCurrency1);
                    setCurrency2(defaultCurrency2);
                }
            } catch (error) {
                showErrorToast({error, defaultMessage:"Error fetching currencies."})
            }
        };
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (currency1 && currency2 && !initRate) {
            updateExchangeRate(currency1, currency2);
        }
    }, [currency1, currency2]);

    useEffect(() => {
        if (rate !== 0) {
            setAmount2(amount1 * rate);
        }
    }, [initRate]);

    const updateExchangeRate = async (from: Currency, to: Currency): Promise<number> => {
        if (!from || !to) return 1;

        if (from.code === to.code) {
            setRate(1);
            return 1;
        }
        let rateX = 1;
        try {
            if(from.code == "RSD" || to.code == "RSD"){
                if(from.code=="RSD"){
                    const data = await getExchangeRate("RSD", to.code);
                    rateX = data.rate;
                    setRate(rateX);
                }
                else {
                    const data = await getExchangeRate("RSD", from.code);
                    rateX = data.inverseRate;
                    setRate(rateX);
                }
            }
            else{
                const data1 = await getExchangeRate("RSD", to.code);
                const data2 = await getExchangeRate("RSD", from.code);
                rateX = data1.rate / data2.rate;
                setRate(rateX);
            }

            if(!initRate) setInitRate(true);

            return rateX;
        } catch (error) {
            showErrorToast({error, defaultMessage:"Error fetching exchange rate."})
        }
        return 1;
    };


    function handleAmount1Change(val: string) {
        if (!currency1 || !currency2) return;

        console.log("A1");
        const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));
        setAmount1(numericValue);
        setAmount2(numericValue * rate);
    }

    function handleAmount2Change(val: string) {
        if (!currency1 || !currency2) return;

        console.log("A2");
        const numericValue = parseFloat(val.replace(/\./g, "").replace(",", "."));
        setAmount2(numericValue);
        setAmount1(numericValue / rate);
    }

    async function handleCurrency1Change(val: string) {
        if (!currency2) return;

        console.log("C1");
        const selectedCurrency = currencies.find((c) => c.code === val);
        if (!selectedCurrency) return;

        setCurrency1(selectedCurrency);
        const newRate = await updateExchangeRate(selectedCurrency, currency2);

        // Recalculate amount2 based on new rate
        setAmount2(amount1 * newRate);
    }

    async function handleCurrency2Change(val: string) {
        if (!currency1) return;

        console.log("C2");
        const selectedCurrency = currencies.find((c) => c.code === val);
        if (!selectedCurrency) return;

        setCurrency2(selectedCurrency);
        const newRate = await updateExchangeRate(currency1, selectedCurrency);
        console.log(newRate);
        // Recalculate amount1 based on new rate
        setAmount1(amount2 * newRate);
    }


    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Currency converter</CardTitle>
            </CardHeader>
            {currency1 && currency2 && (
            <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between font-paragraph">
                <div>
                    <div className="w-20">
                        <Select value={currency1.code} onValueChange={val => handleCurrency1Change(val)}>
                            <SelectTrigger>
                                <SelectValue >{currency1.code}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem
                                        key={item.code}
                                        value={item.code}
                                    >
                                        {item.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency1"
                        value={amount1}
                        onChange={e => handleAmount1Change(e.target.value)}
                        currency={currency1.code}
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
                        <Select value={currency2.code} onValueChange={val => handleCurrency2Change(val)}>
                            <SelectTrigger>
                                <SelectValue>{currency2.code}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((item) => (
                                    <SelectItem
                                        key={item.code}
                                        value={item.code}
                                    >
                                        {item.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <MoneyInput
                        id="currency2"
                        value={amount2}
                        onChange={e => handleAmount2Change(e.target.value)}
                        currency={currency2.code}
                    />
                </div>
            </CardContent> )}

            <CardFooter className="flex flex-col w-full justify-center">

                <CardDescription>
                    Convert between currencies with real-time exchange rates.
                </CardDescription>
                <Button variant="link" size="tight" className="w-fit"
                        onClick={() => navigate("/payments/exchange-rate")}>See current exchange rates</Button>

            </CardFooter>
        </Card>
    );
};

export default ConverterCard;