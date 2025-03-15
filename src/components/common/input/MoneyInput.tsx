import {forwardRef, useEffect, useState} from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/format-currency';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface MoneyInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
    value?: number;
    onValueChange?: (value: number | undefined) => void;
    decimalScale?: number;
    currency?: string;
    placeholder?: string;
    min?: number;
    max?: number;
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>((
    {
        value: controlledValue,
        onValueChange,
        decimalScale = 2,
        currency = 'RSD',
        placeholder,
        min=0,
        max=Infinity,
        ...props
    }, ref) => {


    const [value, setValue] = useState<number | undefined>(controlledValue);

    useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue);
        }
    }, [controlledValue]);

    // Extract currency symbol
    const formattedCurrency = formatCurrency(1, currency).trim();
    const cleanedCurrency = formattedCurrency.replace(/\u00A0/g, ' ');
    const currencySymbol = cleanedCurrency.split(' ').pop();

    const handleChange = (values: {value: string, floatValue: number| undefined}) => {
        const newValue= parseFloat(values.value.replace(/\./g, "").replace(",", "."));
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    const handleBlur = () => {
        if (value !== undefined) {
            if (value < min) {
                setValue(min);
                (ref as React.RefObject<HTMLInputElement>).current!.value = String(min);
            } else if (value > max) {
                setValue(max);
                (ref as React.RefObject<HTMLInputElement>).current!.value = String(max);
            }
        }
    };



    return (
        <div className="flex flex-row">
            <NumericFormat
                placeholder={placeholder}
                value={value}
                onValueChange={handleChange}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={decimalScale}
                fixedDecimalScale
                allowNegative={min < 0}
                customInput={Input}
                getInputRef={ref}
                valueIsNumericString
                onBlur={handleBlur}
                {...props}
                className="rounded-r-none border-r-none"
            />
            <Input
                type="text"
                disabled
                value={currencySymbol}
                className="min-w-15 w-15 rounded-l-none text-center bg-muted"
            />
        </div>
    );
});

export default MoneyInput;