import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
    recipientAccount: string
    recipientNumber: string
    existingRecipients: string[] // lista postojećih brojeva računa
}

export default function AddRecipientTemplate({
                                                 recipientAccount,
                                                 recipientNumber,
                                                 existingRecipients
                                             }: Props) {
    const [recipientExists, setRecipientExists] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    // Proverava da li korisnik već postoji u listi
    useEffect(() => {
        const exists = existingRecipients.includes(recipientAccount)
        setRecipientExists(exists)
    }, [recipientAccount, existingRecipients])

    const handleAdd = async () => {
        try {
            setIsAdding(true)

            /// TODO: Bad API request, need to fix
            const response = await fetch("/api/v1/recipients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    account: recipientAccount,
                    name: recipientNumber
                })
            })

            if (!response.ok) throw new Error("Failed to add recipient")

            console.log("✅ Recipient added successfully")
            setRecipientExists(true)
        } catch (error) {
            console.error("❌ Add recipient failed:", error)
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <Card className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-semibold">Payment Successful!</h2>
            <p className="text-muted-foreground">
                Your payment has been verified and processed.
            </p>

            {!recipientExists && (
                <Button onClick={handleAdd} disabled={isAdding} variant="outline">
                    {isAdding ? "Adding..." : "Add recipient"}
                </Button>
            )}
        </Card>
    )
}
