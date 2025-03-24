import React from "react";
import NewPaymentForm from "@/components/payments/payment-new/NewPaymentForm.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";




function NewPaymentPage() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl w-full text-center">New payment</h1>
            <div className="w-full justify-center flex">
                <NewPaymentForm/>
            </div>
        </main>
    )
}

export default NewPaymentPage;
