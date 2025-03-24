import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import TransactionsDataTable from "@/components/bank-account/bank-account-single/TransactionsDataTable.tsx";
import {BankAccount} from "@/types/bank-account.ts";


interface BankAccountTransactionProps extends React.ComponentProps<"div">{
    account: BankAccount;
    cardTitle: string;
}

const BankAccountTransactionsCard = ({ account, cardTitle, className, ...props }:BankAccountTransactionProps) => {

    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl"> {cardTitle} </CardTitle>
            </CardHeader>
            <CardContent>
            {/*<Tabs defaultValue="transactions">*/}
            {/*    <TabsList className="grid w-full md:grid-cols-2 font-paragraph bg-gray-700 sm:grid-cols-1 sm:h-full">*/}
            {/*        <TabsTrigger value="transactions">*/}
            {/*            Transactions*/}
            {/*           </TabsTrigger>*/}
            {/*        <TabsTrigger value="exchange">*/}
            {/*            Transfers/Exchanges*/}
            {/*        </TabsTrigger>*/}
            {/*    </TabsList>*/}
            {/*    <TabsContent value="transactions">*/}
                    <Card className="rounded-md font-paragraph" >
                        <TransactionsDataTable account={account}/>
                    </Card>
            {/*    </TabsContent>*/}
            {/*    <TabsContent value="exchange">*/}
            {/*        <Card className="rounded-md font-paragraph" >*/}
            {/*            <TransactionsDataTable account={account} transactionType={1}/>*/}
            {/*        </Card>*/}
            {/*    </TabsContent>*/}
            {/*</Tabs>*/}
            </CardContent>
        </Card>
    )
}

export default BankAccountTransactionsCard;