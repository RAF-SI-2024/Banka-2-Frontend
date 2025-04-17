import React, { useState } from "react";
import {
  Card,
  CardContent, CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { CardDTO } from "@/types/bank_user/card.ts";
import {changeCardStatusClient} from "@/api/bank_user/card.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";
import BankAccountDetailsAdjustLimitsDialog
  from "@/components/bank-account/bank-account-single/BankAccountDetailsAdjustLimitsDialog.tsx";
import BankCardAdjustLimitDialog from "@/components/card/card-single/BankCardAdjustLimitDialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";

interface Props {
  card: CardDTO;
  onBackClick: () => void;
}

const CardDetails = ({ card, onBackClick }: Props) => {
  const [isBlocked, setIsBlocked] = useState(!card.status);

  const [isAdjustLimitDialogOpen, setAdjustLimitDialogOpen] = useState(false);
  const [limit, setLimit] = useState(card?.limit ?? 0);

  const onBlockClick = async (cardId: string) => {
    console.log("Blocking the card");
    try {
      const response = await changeCardStatusClient(cardId, false);
      if (response.status !== 200) {
        throw new Error("Failed to block this card");
      }
      showSuccessToast({description:"Card blocked successfully"});
      setIsBlocked(true);
    } catch (err) {
      console.error(err);
      showErrorToast({error: err, defaultMessage: "Failed to block this card"});
    }
  };

  const handleAdjustLimitClick = () => {
    setAdjustLimitDialogOpen(true);
  };


  return (
      <Card className="h-full border-0 content-center">
        <CardHeader className="mb-2 flex flex-row -ml-4 items-center gap-2">
          <Button size="icon" variant="ghost" onClick={onBackClick}>
            <span className="icon-[ph--caret-left] size-6" />
          </Button>
          <CardTitle className="font-heading text-2xl">Card Details</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 font-paragraph">

          <div className="flex flex-col gap-1 items-baseline w-full">
            <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
              Account:
            </Label>
            <div className="w-full flex items-center gap-3 p-4 border border-border rounded-lg  shadow-sm">
              <span className="icon-[ph--identification-card] text-2xl text-primary"></span>
              <div className="text-sm flex flex-col gap-2 p-2">
                <div className="flex gap-2 flex-wrap">
              <span className="font-medium text-muted-foreground">
                Account name:
              </span>
                  <p className="font-paragraph">
                    {card.account.name || "This account does not have a name"}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
              <span className="font-medium text-muted-foreground">
                Account number:
              </span>
                  <p className="font-paragraph">{card.account.accountNumber}</p>
                </div>
              </div>
            </div>
          </div>



          <div className="flex flex-row items-baseline gap-2">
            <Label htmlFor="label" className="text-xl font-light text-muted-foreground">
              Limit:
            </Label>
            <p className="text-xl font-medium">
              {formatCurrency(limit, card.account.currency.code)}
            </p>
          </div>

        </CardContent>


        <CardFooter className="flex justify-center">
          {!isBlocked ? (
              <div className="flex-row flex gap-4 w-full">
                <Button variant="destructive" size="sm" onClick={() => onBlockClick(card.id)}>
                  <span className="icon-[ph--x-circle] text-lg"></span>
                  Block card
                </Button>

                <Button variant="outline" size="sm"  onClick={handleAdjustLimitClick}>
                  Adjust limit
                  <span className="icon-[ph--gear] text-base"></span>
                </Button>
              </div>
          ) : (
              <Alert
                  variant="destructive"
                  className="relative flex items-center p-4 gap-2"
              >
                <span className="icon-[ph--x-circle] size-6 flex-shrink-0" />
                <div className="min-w-0">
                  <AlertTitle>{card.name} is blocked!</AlertTitle>
                  <AlertDescription>
                    <p className="w-full">
                      This card is currently blocked and can only be unblocked by
                      a bank employee.
                    </p>
                  </AlertDescription>
                </div>
              </Alert>
          )}
        </CardFooter>

        <BankCardAdjustLimitDialog card={card}
                                   showDialog={isAdjustLimitDialogOpen}
                                   setShowDialog={setAdjustLimitDialogOpen}
                                   setLimit={setLimit} />
      </Card>
  );
};

export default CardDetails;
