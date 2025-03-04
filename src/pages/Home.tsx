import BalanceCard from "@/components/home/BalanceCard.tsx";
import QuickPaymentCard from "@/components/home/QuickPaymentCard.tsx";
import ConverterCard from "@/components/home/ConverterCard.tsx";


export default function HomePage() {
    const firstName = JSON.parse(sessionStorage.getItem('user') || '{}')?.firstName || 'User';

    return (


                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="font-display font-bold text-5xl">Welcome back, {firstName}!</h1>
                    {/* Kartice sa placeholder tekstom */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <BalanceCard />
                        <QuickPaymentCard />
                        <ConverterCard />
                        {/*<Card>*/}
                        {/*    <CardHeader>*/}
                        {/*        <CardTitle>Welcome to BankToo</CardTitle>*/}
                        {/*    </CardHeader>*/}
                        {/*    <CardContent>*/}
                        {/*        Explore your financial dashboard and manage transactions effortlessly.*/}
                        {/*    </CardContent>*/}
                        {/*</Card>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle>Live Market Data</CardTitle>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent>*/}
                    {/*            Stay tuned! Market data will be available soon.*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle>Secure Transactions</CardTitle>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent>*/}
                    {/*            Trade confidently with our secure and fast system.*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    </div>

                    {/*/!* Placeholder sekcija dok ne stignu pravi podaci *!/*/}
                    {/*<div*/}
                    {/*    className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">*/}
                    {/*    <p className="text-lg text-muted-foreground">*/}
                    {/*        Data loading... Please wait.*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                </main>

    )
}
