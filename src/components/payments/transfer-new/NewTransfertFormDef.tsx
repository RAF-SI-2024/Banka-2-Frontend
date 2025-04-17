import * as z from "zod";

export const newTransferFormSchema = z.object({
    fromAccountNumber: z.string(),
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
            .gt(0, "Amount is too small")
    ),
    purpose: z.coerce.string().min(1, "Payment purpose is required.").max(1024, "Purpose must be less than 1024 characters."),
});