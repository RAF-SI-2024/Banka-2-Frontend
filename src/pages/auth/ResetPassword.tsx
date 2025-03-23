import * as React from "react";
import NewPasswordForm from "@/components/auth/password-reset/NewPasswordForm.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import * as z from "zod";
import {activateUser} from "@/api/auth.ts";

export default function ResetPassPage({
  className
  , ...props
}: React.ComponentProps<"div">){


    return(
        <>

            <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                {/*Reset password text - behind the particles*/}
                <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                    Reset your password</h1>
                {/*Reset password form/card - in front of the parrticles*/}
                <div className="w-full max-w-sm z-10 relative">
                    <NewPasswordForm/>
                </div>
            </div>

        </>
    )

}