import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {TabsContent, TabsList, Tabs, TabsTrigger} from "@/components/ui/tabs";
import TransactionsDataTable from "@/components/bank-account/TransactionsDataTable.tsx";
import {BankAccount} from "@/types/bankAccount.ts";


interface BankAccountTransactionProps extends React.ComponentProps<"div">{
    account: BankAccount;
}


const BankAccountTransactionsCard = ({ account, className, ...props }:BankAccountTransactionProps) => {
    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl">Recent transactions</CardTitle>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="transactions">
                <TabsList className="grid w-full grid-cols-2 font-paragraph bg-gray-700">
                    <TabsTrigger value="transactions">
                        Transactions
                       </TabsTrigger>
                    <TabsTrigger value="exchange">
                        Exchange
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <Card className="rounded-md font-paragraph" >
                        <TransactionsDataTable account={account}/>
                    </Card>
                </TabsContent>
                <TabsContent value="exchange">
                    <Card className="rounded-md font-paragraph" >
                        <TransactionsDataTable account={account}/>
                    </Card>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
    )
}

export default BankAccountTransactionsCard;