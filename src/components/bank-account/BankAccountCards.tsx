import { cn } from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BankAccount} from "@/types/bankAccount.ts";
import React from "react";
import {CardSwipe} from "@/components/ui/card-swipe.tsx";
import {CreditCard} from "@/components/ui/credit-card.tsx";
import {Card as CardEntity} from "@/types/card.ts"
import {CardType} from "@/types/cardType.ts";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {Tooltip, TooltipProvider, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";


interface BalanceCardProps extends React.ComponentProps<"div">{
    account: BankAccount,
}

const NewCreditCardButton = (
        <Button
            className="w-fit"
            variant="success"
            onClick={() => {/*TODO: Create card dialog open*/}}
        >
            <span className="icon-[ph--plus] text-lg"></span>
            Create a new credit card

        </Button>
)

const CreditCardSwipe = (account: BankAccount, cards : CardEntity[], handleCardClick: (id: string) => void) => {
    return (
        <div className="flex flex-col w-full items-center gap-4">
            <TooltipProvider>

                <CardSwipe
                    elements={cards.map((card) => (
                        <Tooltip>
                            {/* Wrap tooltip content in TooltipTrigger */}
                            <TooltipTrigger>

                                <div
                                    onClick={() => handleCardClick(card.id)}
                                    className="cursor-pointer inline-block w-full"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <CreditCard
                                        title={card.name}
                                        cardHolder={`${card.account.client.firstName} ${card.account.client.lastName}`}
                                        cardNumber={card.number}
                                        expiryDate={format(card.expiresAt, "MM/yy")}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                className="z-1000"
                                side="top"
                                align="center"
                            >
                                <p className="font-paragraph bg-primary">Click {card.name} for more details</p>
                            </TooltipContent>

                        </Tooltip>
                    ))}
                    autoplayDelay={5000}
                    slideShadows={false}
                />



            </TooltipProvider>
            {/*Add a button if less then 2 credit cards (from spec)*/}
            {account.accountType.name.toLowerCase()!=="business" //TODO: CHECK WITH BACKEND ACC TYPE
                && cards.length < 2
                && NewCreditCardButton
            }

        </div>
    )

}

const BankAccountCardsCard = ({ account, className, ...props }: BalanceCardProps) => {


    const cardType: CardType = {
        id: "1",
        name: "Debit",
        createdAt: new Date(),
        modifiedAt: new Date(),
    }

    const card: CardEntity = {
        id: "1",
        type: cardType,
        name: "Visa",
        expiresAt: new Date(),
        account: account,
        cvv: "255",
        number: "4111 1111 1111 9743",
        limit: 10000,
        status: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    }

    const cards: CardEntity[] = [card, card];
    const navigate = useNavigate();

    const handleCardClick = (cardId: string) => {
        navigate(`/cards/${cardId}`); // Navigate to the card's route
    };

    const cardsList = () => {
        if (cards.length === 0) {
            return (
                <>
                    <CardDescription className="font-paragraph flex flex-col items-center gap-4">
                        You do not have any cards for this bank account.
                        {NewCreditCardButton}
                    </CardDescription>

                </>
            )
        }
        else return CreditCardSwipe(account, cards, handleCardClick);
    }

    return (
        <Card
            className={cn(
                "border-0 content-center",
                className
            )}
            {...props}
        >
            <CardHeader className="mb-2">
                <CardTitle className="font-heading text-2xl">Cards</CardTitle>
            </CardHeader>
            <CardContent>
                {cardsList()}
            </CardContent>
        </Card>
    );
}

export default BankAccountCardsCard;