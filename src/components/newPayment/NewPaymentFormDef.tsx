import {z} from "zod";

export const paymentSchema = z.object({
    recipientAccount: z.string().length(18, "Recipient account must be 18 characters long."),
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

    referenceNumber: z
        .string()
        .max(20, "Maximum 20 characters.")
        .regex(/^[0-9-]*$/, "Only numbers and '-' are allowed")
        .optional()
        .or(z.literal("")),

    paymentCode: z.string().optional(),
    purpose: z.string().min(1, "Payment purpose is required.").max(1024, "Purpose must be less than 1024 characters."),
    accountId: z.string().min(1, "Payer account is required."),
    otp: z.string().length(6, "OTP is required."),
});