import * as React from "react";
import ResetPassForm from "@/components/passwordReset/ResetPassForm.tsx";

export default function ResetPassPage(){

    return(
        <>

            <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                {/*Reset password text - behind the particles*/}
                <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                    Reset your password</h1>
                {/*Reset password form/card - in front of the parrticles*/}
                <div className="w-full max-w-sm z-10 relative">
                    <ResetPassForm/>
                </div>
            </div>

        </>
    )

}