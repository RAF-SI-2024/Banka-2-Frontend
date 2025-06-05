import {z} from "zod";

const createOrderMarketFormSchema = z.object({
    amount:  z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .gt(0, "Amount is too small")
    ),
    allOrNone: z.boolean(),
    margin: z.boolean(),
    accountNumber: z.string(),
})

const createOrderLimitFormSchema = z.object({
    amount:  z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .gt(0, "Amount is too small")
    ),
    limitValue: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(0, "Limit value is too small")
    ),
    allOrNone: z.boolean(),
    margin: z.boolean(),
    accountNumber: z.string(),
})

const createOrderStopFormSchema = z.object({
    amount:  z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .gt(0, "Amount is too small")
    ),
    stopValue: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(0, "Stop value is too small")
    ),
    allOrNone: z.boolean(),
    margin: z.boolean(),
    accountNumber: z.string(),
})

const createOrderStopLimitFormSchema = z.object({
    amount:  z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .gt(0, "Amount is too small")
    ),
    limitValue: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(0, "Limit value is too small")
    ),
    stopValue: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if(val.length == 0)
                    return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(0, "Stop value is too small")
    ),
    allOrNone: z.boolean(),
    margin: z.boolean(),
    accountNumber: z.string(),
})


export function orderToFormSchema(variant:string){
    switch (variant) {
        case "market":
            return createOrderMarketFormSchema;
        case "limit":
            return createOrderLimitFormSchema;
        case "stop":
            return createOrderStopFormSchema;
        case "stop_limit":
            return createOrderStopLimitFormSchema;
        default:
            return createOrderMarketFormSchema;
    }
}