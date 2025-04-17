import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { CreditCard } from "@/components/ui/credit-card.tsx"
import { CardDTO as CardType } from "@/types/bank_user/card.ts"
import { format } from "date-fns"
import { Button } from "@/components/ui/button.tsx"
import {Client} from "@/types/bank_user/user.ts";

interface Props {
    card: CardType
    cardHolder: Client
    onDetailsClick?: () => void
}

const CardDisplay = ({ card, cardHolder, onDetailsClick }: Props) => {
    const expiryDate = format(card.expiresAt, "MM/yy")

    return (
        <Card className="border-0 content-center h-full">
            <CardHeader>
                {/*<CardTitle className="font-heading text-2xl">Card</CardTitle>*/}
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <CreditCard
                    title={card.type.name}
                    cardHolder={cardHolder.firstName + " " + cardHolder.lastName}
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
