import {Card, CardContent} from "@/components/ui/card.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {orderToFormSchema} from "@/components/trading/CreateOrderFormDef.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import SecurityInput from "@/components/__common__/input/SecurityInput.tsx";
import MoneyInput from "@/components/__common__/input/MoneyInput.tsx";
import {CreateOrderRequest, OrderDirection, OrderType} from "@/types/exchange/order.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {createOrder} from "@/api/exchange/order.ts";
import {useEffect, useState} from "react";
import {getSecurityOfType} from "@/api/exchange/security.ts";
import {SecurityType} from "@/types/exchange/security.ts";


interface SecurityCreateOrderProps {
    direction: "buy" | "sell";
    variant: string,
}

function getOrderTypeFromVariant(variant: string): OrderType {
    switch (variant) {
        case "market":
            return OrderType.MARKET;
        case "limit":
            return OrderType.LIMIT;
        case "stop":
            return OrderType.STOP;
        case "stop_limit":
            return OrderType.STOP_LIMIT;
        default:
            return OrderType.INVALID;
    }
}


export default function SecurityCreateOrder({direction, variant}: SecurityCreateOrderProps) {

    const schema = orderToFormSchema(variant);

    const segments = location.pathname.split("/");
    const securityId = segments[segments.indexOf("trading") + 2];
    const securityType = segments[segments.indexOf("trading") + 1];

    const [ticker, setTicker] = useState<string>("");

    useEffect(() => {
        async function fetchSecurity() {
            try {
                const securityTypeOf: SecurityType = (() => {
                    switch (securityType) {
                        case "stock":
                            return SecurityType.Stock;
                        case "future":
                            return SecurityType.Future;
                        case "forex":
                            return SecurityType.Forex;
                        case "option":
                            return SecurityType.Option;
                        default:
                            return SecurityType.Unknown;
                    }
                })();
                const security = await getSecurityOfType(securityTypeOf, securityId);
                setTicker(security.ticker);
            } catch (error) {
                console.error("❌ Failed to fetch security", error);
            }
        }

        if (securityType && securityId) {
            fetchSecurity();
        }
    }, [securityType, securityId]);

    async function onSubmit(values: z.infer<typeof schema>){

        try {
            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            const orderDirection = direction === "buy" ? OrderDirection.BUY : OrderDirection.SELL;
            const permission = user.permission;
            const orderRequest: CreateOrderRequest = {
                actuaryId: user.id,
                accountNumber: values.accountNumber,
                orderType: getOrderTypeFromVariant(variant),
                quantity: values.amount,
                contractCount: 10,
                limitPrice: 0,
                stopPrice: 0,
                direction: orderDirection,
                securityId: securityId,
            }

            if(permission === 26){
                orderRequest.supervisorId = user.id;
            }


            if ("limitValue" in values) {
                orderRequest.limitPrice = values.limitValue as number;
            }

            if ("stopValue" in values) {
                orderRequest.stopPrice = values.stopValue as number;
            }

            const response = await createOrder(orderRequest);
            console.log("✅ Order created", response);
        } catch (error) {
            console.error("❌ Failed to create order", error);
        }

    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            amount: 1,
            allOrNone: false,
            margin: false,
            accountNumber: "",
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
                                        <SecurityInput symbol={ticker || "BTC"} fixedDecimalScale={false} decimalScale={8} onChange={field.onChange} defaultValue={1}/>
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
                            {/*<FormField*/}
                            {/*    key="allOrNone"*/}
                            {/*    name="allOrNone"*/}
                            {/*    render={({ field: fieldProps }) => (*/}
                            {/*        <FormItem className="flex md:flex-row sm:flex-col items-end space-r-3  pl-0 w-full">*/}
                            {/*            <FormControl>*/}
                            {/*                <Checkbox*/}
                            {/*                    checked={fieldProps.value}*/}
                            {/*                    onCheckedChange={fieldProps.onChange}*/}
                            {/*                />*/}
                            {/*            </FormControl>*/}
                            {/*            <FormLabel className="font-normal">All or none</FormLabel>*/}

                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            {/*<FormField*/}
                            {/*    key="margin"*/}
                            {/*    name="margin"*/}
                            {/*    render={({ field: fieldProps }) => (*/}
                            {/*        <FormItem className="flex flex-row items-end space-r-3  pl-0 w-full">*/}
                            {/*            <FormControl>*/}
                            {/*                <Checkbox*/}
                            {/*                    checked={fieldProps.value}*/}
                            {/*                    onCheckedChange={fieldProps.onChange}*/}
                            {/*                />*/}
                            {/*            </FormControl>*/}
                            {/*            <FormLabel className="font-normal">Margin</FormLabel>*/}

                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            <FormField
                                name="accountNumber"
                                render={({ field }) => {
                                    const user = React.useMemo(() => {
                                        try {
                                            return JSON.parse(sessionStorage.getItem("user") || "{}");
                                        } catch {
                                            return {};
                                        }
                                    }, []);

                                    const accounts = user.accounts || [];


                                    return (
                                        <FormItem className="flex flex-col w-full gap-2">
                                            <FormLabel>Your Account Number</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {accounts.map((acc: any) => (
                                                            <SelectItem key={acc.id} value={acc.accountNumber}>
                                                                {acc.accountNumber}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    );
                                }}
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