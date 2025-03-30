import {forwardRef, useEffect, useState} from 'react';
import { Input } from '@/components/ui/input';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface SecurityInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number | undefined) => void;
    decimalScale?: number;
    symbol?: string;
    placeholder?: string;
    min?: number;
    max?: number;
}

const SecurityInput = forwardRef<HTMLInputElement, SecurityInputProps>((
    {
        value: controlledValue,
        defaultValue = 0,
        onValueChange,
        symbol,
        decimalScale = 2,
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
                defaultValue={defaultValue}
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
                className={symbol && "rounded-r-none border-r-none"}
            />
            {symbol &&
                <Input
                    type="text"
                    disabled
                    value={symbol}
                    className="min-w-15 w-15 rounded-l-none text-center bg-muted"
                />
            }
        </div>
    );
});

export default SecurityInput;