import BalanceCard from "@/components/home/BalanceCard.tsx";
import QuickPaymentCard from "@/components/home/QuickPaymentCard.tsx";
import ConverterCard from "@/components/home/ConverterCard.tsx";
import RecentTransactionsCard from "@/components/home/RecentTransactions.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";


export default function HomePage() {
    const firstName = JSON.parse(sessionStorage.getItem('user') || '{}')?.firstName || 'User';

    return (


                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Toaster richColors />
                    <h1 className="font-display font-bold text-5xl">Welcome back, {firstName}!</h1>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <BalanceCard />
                        <QuickPaymentCard />
                        <ConverterCard />
                        <RecentTransactionsCard />
                    </div>

                </main>

    )
}
