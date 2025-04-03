import ExchangeTable from "@/components/exchange-table/ExchangeTable";
import { Toaster } from "sonner";


export default function Exchanges() {
    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Exchanges</h1> 
                <ExchangeTable/>
        </main>  
    );
}
