import {Card, CardContent} from "@/components/ui/card.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {orderToFormSchema} from "@/components/trading/CreateOrderFormDef.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import SecurityInput from "@/components/__common__/input/SecurityInput.tsx";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";


interface SecurityCreateOrderProps {
    direction: "buy" | "sell";
    variant: string,
}



export default function SecurityCreateOrder({direction, variant}: SecurityCreateOrderProps) {

    const schema = orderToFormSchema(variant);

    async function onSubmit(values: z.infer<typeof schema>){
        console.log(values);
    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            amount: 1,
            allOrNone: false,
            margin: false,
        },
    });



    return(
        <Card className="w-full border-0 shadow-none">
            <CardContent className="pt-4 w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
                        <FormField
                            key="amount"
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <SecurityInput symbol={"BTC"} fixedDecimalScale={false} decimalScale={8} onChange={field.onChange} defaultValue={1}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {(variant === "limit" || variant === "stop_limit") &&
                            <FormField
                                key="limitValue"
                                name="limitValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Limit</FormLabel>
                                        <FormControl>
                                            <MoneyInput currency={"RSD"}  fixedDecimalScale={false} decimalScale={4} onChange={field.onChange} defaultValue={0}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }



                        {(variant === "stop" || variant === "stop_limit") &&
                            <FormField
                                key="stopValue"
                                name="stopValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stop</FormLabel>
                                        <FormControl>
                                            <MoneyInput currency={"RSD"} fixedDecimalScale={false} decimalScale={4} onChange={field.onChange} defaultValue={0}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }


                        <div className="w-full flex md:flex-row sm:flex-col gap-2 py-2">
                            <FormField
                                key="allOrNone"
                                name="allOrNone"
                                render={({ field: fieldProps }) => (
                                    <FormItem className="flex md:flex-row sm:flex-col items-end space-r-3  pl-0 w-full">
                                        <FormControl>
                                            <Checkbox
                                                checked={fieldProps.value}
                                                onCheckedChange={fieldProps.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">All or none</FormLabel>

                                    </FormItem>
                                )}
                            />
                            <FormField
                                key="margin"
                                name="margin"
                                render={({ field: fieldProps }) => (
                                    <FormItem className="flex flex-row items-end space-r-3  pl-0 w-full">
                                        <FormControl>
                                            <Checkbox
                                                checked={fieldProps.value}
                                                onCheckedChange={fieldProps.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">Margin</FormLabel>

                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className="w-full pt-3">
                            <Button variant={direction === "buy" ? "success": "destructive"}
                                    className="w-full" size="lg" type="submit">{direction === "buy" ? "Buy": "Sell"} </Button>
                        </div>
                    </form>
                </Form>

            </CardContent>
        </Card>
    )
}