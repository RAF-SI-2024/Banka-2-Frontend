import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Card as CardType } from "@/types/card.ts"
import { BankAccount } from "@/types/bankAccount.ts"
import { Button } from "@/components/ui/button.tsx"

interface Props {
    card: CardType
    account: BankAccount
    onBackClick: () => void
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

            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-muted shadow-sm">
                    <div className="text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                        >
                            <path d="M200 112a8 8 0 0 1-8 8h-40a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8m-8 24h-40a8 8 0 0 0 0 16h40a8 8 0 0 0 0-16m40-80v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-16 144V56H40v144zm-80.26-34a8 8 0 1 1-15.5 4c-2.63-10.26-13.06-18-24.25-18s-21.61 7.74-24.25 18a8 8 0 1 1-15.5-4a39.84 39.84 0 0 1 17.19-23.34a32 32 0 1 1 45.12 0a39.76 39.76 0 0 1 17.2 23.34ZM96 136a16 16 0 1 0-16-16a16 16 0 0 0 16 16"/>
                        </svg>
                    </div>
                    <div className="text-sm flex flex-col gap-2 p-2">
                        <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[140px]">Connected Account:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{account.name}</span>
                        </div>

                        <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[140px]">Account Number:</span>
                            <span className="font-mono text-gray-900 dark:text-white tracking-wide">{account.accountNumber}</span>
                        </div>
                    </div>
                </div>

                {!card.status && (
                    <div className="p-4 border-l-4 border-red-500 bg-red-100 text-red-800 rounded-md text-sm">
                        This card is currently blocked and can only be unblocked by a bank employee.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CardDetails
