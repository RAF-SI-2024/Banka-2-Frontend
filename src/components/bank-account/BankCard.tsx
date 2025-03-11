import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "@/components/ui/credit-card"
import { Card as CardType } from "@/types/card"
import { format } from "date-fns"

interface Props {
    card: CardType
    cardHolder: string
}

const CardDisplay = ({ card, cardHolder }: Props) => {
    const expiryDate = format(card.expiresAt, "MM/yy")

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Card</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <CreditCard
                    title={card.name}
                    cardHolder={cardHolder}
                    cardNumber={card.number}
                    expiryDate={expiryDate}
                />
            </CardContent>
        </Card>
    )
}

export default CardDisplay
