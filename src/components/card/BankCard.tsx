import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { CreditCard } from "@/components/ui/credit-card.tsx"
import { Card as CardType } from "@/types/card.ts"
import { format } from "date-fns"
import { Button } from "@/components/ui/button.tsx"

interface Props {
    card: CardType
    cardHolder: string
    onDetailsClick?: () => void
}

const CardDisplay = ({ card, cardHolder, onDetailsClick }: Props) => {
    const expiryDate = format(card.expiresAt, "MM/yy")

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Card</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <CreditCard
                    title={card.name}
                    cardHolder={cardHolder}
                    cardNumber={card.number}
                    expiryDate={expiryDate}
                />
                <Button variant="negative" size="lg" onClick={onDetailsClick}>
                    Details
                </Button>
            </CardContent>
        </Card>
    )
}

export default CardDisplay
