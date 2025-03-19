import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {addTransactionTemplate} from "@/api/bankAccount.ts";
import {useNavigate} from "react-router-dom";

interface Props {
    recipientAccount: string;
    existingRecipients: string[];
}

export default function AddRecipientTemplate({
                                                 recipientAccount,
                                                 existingRecipients
                                             }: Props) {
    const [recipientExists, setRecipientExists] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const exists = existingRecipients.includes(recipientAccount);
        setRecipientExists(exists);
    }, [recipientAccount, existingRecipients]);

    const handleAdd = async () => {
        if (!templateName.trim()) {
            alert("Please enter a template name.");
            return;
        }

        try {
            setIsAdding(true);

            await addTransactionTemplate({
                name: templateName.trim(),
                accountNumber: recipientAccount
            });

            alert("Recipient added successfully")
            navigate("/home")
            setRecipientExists(true);
        } catch (error) {
            console.error("Add recipient failed:", error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-semibold">Payment Successful!</h2>
            <p className="text-muted-foreground">
                Your payment has been verified and processed.
            </p>
            <p className="text-muted-foreground">
                Do you wish to add the recipient?
            </p>

            {!recipientExists && (
                <div className="space-y-4">
                    <Input
                        placeholder="Enter template name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <div className="flex justify-center gap-4"> {/* Ovo pravi razmak između dugmadi */}
                        <Button onClick={handleAdd} disabled={isAdding || !templateName.trim()} variant="outline">
                            {isAdding ? "Adding..." : "Add recipient"}
                        </Button>
                        <Button onClick={()=>navigate("/home")} variant="outline">
                            No, thanks
                        </Button>
                    </div>
                </div>

            )}
        </Card>
    );
}
