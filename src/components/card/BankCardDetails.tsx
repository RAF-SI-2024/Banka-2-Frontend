import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { CardDTO } from "@/types/card.ts";
import { changeCardStatusClient } from "@/api/card.ts";
import { showErrorToast, showSuccessToast } from "@/utils/show-toast-utils.tsx";

interface Props {
  card: CardDTO;
  onBackClick: () => void;
}

const CardDetails = ({ card, onBackClick }: Props) => {
  const [isBlocked, setIsBlocked] = useState(card.status === false);

  const onBlockClick = async (cardId: string) => {
    console.log("Blocking the card");
    try {
      const response = await changeCardStatusClient(cardId, false);
      if (response.status !== 200) {
        throw new Error("Failed to block this card");
      }
      showSuccessToast({ description: "Card blocked successfully" });
      setIsBlocked(true);
    } catch (err) {
      console.error(err);
      showErrorToast({
        error: err,
        defaultMessage: "Failed to block this card",
      });
    }
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
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/75 shadow-sm">
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

        <div className="flex justify-center">
          {!isBlocked ? (
            <Button variant="destructive" onClick={() => onBlockClick(card.id)}>
              <span className="icon-[ph--x-circle] text-lg"></span>
              Block card
            </Button>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDetails;
