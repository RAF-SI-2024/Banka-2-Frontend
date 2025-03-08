import { cn } from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BankAccount} from "@/types/bankAccount.ts";
import React from "react";
import {CardSwipe} from "@/components/ui/card-swipe.tsx";
import {CreditCard} from "@/components/ui/credit-card.tsx";
import {Card as CardEntity} from "@/types/card.ts"
import {CardType} from "@/types/cardType.ts";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {Tooltip, TooltipProvider, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip.tsx";


interface BalanceCardProps extends React.ComponentProps<"div">{
    account: BankAccount,
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

    const cards = [card, card];
    const navigate = useNavigate();

    const handleCardClick = (cardId: string) => {
        navigate(`/cards/${cardId}`); // Navigate to the card's route
    };

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

            </CardContent>
        </Card>
    );
}

export default BankAccountCardsCard;