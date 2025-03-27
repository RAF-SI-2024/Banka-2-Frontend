import {Card, CardContent} from "@/components/ui/card.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form.tsx";
import {orderToFormSchema} from "@/components/securities/CreateOrderFormDef.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";


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

        },
    });



    return(
        <Card className="w-full">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >

                        <div className="w-full pt-12 pb-24 ">
                            <Button variant={direction === "buy" ? "success": "destructive"}
                                    className="w-fit" size="lg" type="submit">{direction === "buy" ? "Buy": "Sell"} </Button>
                        </div>
                    </form>
                </Form>

            </CardContent>
        </Card>
    )
}