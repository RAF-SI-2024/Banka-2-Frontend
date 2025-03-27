import {z} from "zod";

const createOrderMarketFormSchema = z.object({

})


export function orderToFormSchema(variant:string){
    switch (variant) {
        case "market":
            return createOrderMarketFormSchema;
        default:
            return createOrderMarketFormSchema;
    }
}