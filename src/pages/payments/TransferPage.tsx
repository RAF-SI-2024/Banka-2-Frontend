import NewTransferForm from "@/components/payments/transfer-new/NewTransferForm.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";


export default function TransfersPage() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl w-full text-center">New transfer/exchange</h1>
            <div className="w-full justify-center flex">
                <NewTransferForm/>
            </div>
        </main>

    );
}
