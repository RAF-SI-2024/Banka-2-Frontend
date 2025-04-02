import {Toaster} from "@/components/ui/sonner.tsx";
import React from "react";
import SecurityListCard from "@/components/securities/SecurityListCard.tsx";
import SecurityDetailsCard from "@/components/securities/SecurityDetails.tsx";
import SecurityGraph from "@/components/securities/SecurityGraph.tsx";


const securities = [
    {
        name: "Security1",
    }
]

export default function Security() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full max-w-screen-2xl  mx-auto">
            <Toaster richColors />
            {!securities || securities.length === 0 ? (
                <h1 className="text-center text-2xl font-semibold text-destructive">
                    Failed to fetch securities
                </h1>
            ) : (
                <>
                    <h1 className="font-display font-bold text-5xl">
                        {securities[0].name} overview
                    </h1>

                    <div className="grid md:grid-rows-2 auto-rows-min gap-4 grid-cols-8 h-full w-full max-w-dvw max-h-fit">
                        {/* Graph starts at row 1 and spans 3 rows */}
                        <SecurityGraph title="SC1" className="md:row-start-1 row-span-1 row-start-2 md:col-span-6 col-span-8" />

                        {/* Details start at row 4 to avoid overlap */}
                        <SecurityDetailsCard className="md:row-start-2 row-span-1 row-start-3 md:col-span-6 col-span-8" />

                        {/* List card moves below everything on small screens */}
                        <SecurityListCard className="md:col-span-2 md:col-start-7 md:row-start-1 row-start-1 md:row-span-2 col-span-8" />
                    </div>




                </>
            )}
        </main>

    );
}