import * as z from "zod";

export const newTransferFormSchema = z.object({
    fromAccountId: z.string(),
    toAccountNumber: z.string(),
    amount: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if (val.length === 0) return 0;
                return parseFloat(val.replace(/\./g, "").replace(",", "."));
            }
            return Number(val);
        },
        z.number()
            .min(10, "Amount is too small")
            .max(500000000, "Amount is too big")
    ),
    purpose: z.coerce.string().min(1, "Payment purpose is required."),
});