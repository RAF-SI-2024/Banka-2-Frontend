import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Card as CardType } from "@/types/card.ts";
import { BankAccount } from "@/types/bankAccount.ts";
import { Button } from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

interface Props {
  card: CardType;
  account: BankAccount;
  onBackClick: () => void;
}

const CardDetails = ({ card, account, onBackClick }: Props) => {
  return (
    <Card className="border-0">
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
                {account.name}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="font-medium text-muted-foreground">
                Account number:
              </span>
              <p className="font-paragraph">
                {account.accountNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {card.status ? (
            <Button variant="destructive">
              <span className="icon-[ph--x-circle] text-lg"></span>
              Block card
            </Button>
          ) : (
              <Alert variant="destructive" className="relative flex items-center p-4 gap-2">
                <span className="icon-[ph--x-circle] size-6 flex-shrink-0" />
                <div className="min-w-0">
                  <AlertTitle>{card.name} is blocked!</AlertTitle>
                  <AlertDescription>
                    <p className="w-full">
                      This card is currently blocked and can only be unblocked by a bank
                      employee.
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
