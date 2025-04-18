import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {createTransactionTemplate} from "@/api/bank_user/template.ts";

interface Props {
    homeNavigate: () => void;
    recipientAccount?: string;
    existingRecipients?: string[];
}

export default function AddRecipientTemplate({
                                                 homeNavigate,
                                                 recipientAccount,
                                                 existingRecipients
                                             }: Props) {
    const [recipientExists, setRecipientExists] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [templateName, setTemplateName] = useState("");

    useEffect(() => {
        if(recipientAccount && existingRecipients){
            const exists = existingRecipients.includes(recipientAccount);
            setRecipientExists(exists);
        }
    }, [recipientAccount, existingRecipients]);

    const handleAdd = async () => {
        if (!templateName.trim()) {
            alert("Please enter a template name.");
            return;
        }

        try {
            setIsAdding(true);
            if(!recipientAccount)
                throw new Error("Recipient account not found");

            await createTransactionTemplate(templateName.trim(), recipientAccount);

            console.log("Recipient added successfully");

            homeNavigate();

            setRecipientExists(true);
        } catch (error) {
            showErrorToast({error, defaultMessage:"Adding recipient failed."})
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="text-center p-8 space-y-4 bg-transparent border-none">
            <h2 className="text-2xl font-semibold">Payment Successful!</h2>
            <p className="text-muted-foreground">
                Your payment has been verified and processed.
            </p>

            {recipientAccount && !recipientExists && (
                <div className="space-y-4">
                    <Input
                        placeholder="Enter template name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <Button onClick={handleAdd} disabled={isAdding || !templateName.trim()} variant="outline">
                        {isAdding ? "Adding..." : "Add recipient"}
                    </Button>
                </div>
            )}
        </Card>
    );
}
