import * as React from "react";
import ResetPassReqForm from "@/components/passwordReset/ResetPassReqForm.tsx";

export default function ResetPassReqPage(){

    return(
        <>


            {/*put the card and text in the center of the page, gap-2 for spacing between text and card*/}
                <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                    {/*Reset password text - behind the particles*/}
                    <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                        Reset your password</h1>
                    {/*Reset password form/card - in front of the parrticles*/}
                    <div className="w-full max-w-sm z-10 relative">
                        <ResetPassReqForm/>
                    </div>
                </div>

        </>
    )

}