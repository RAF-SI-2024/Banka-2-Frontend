import * as React from "react";
import {cn} from "@/lib/utils.ts";

export default function SuccessNotificationCard(){

    return (
        <>
            <div className="flex justify-start ">
                <div className="w-full max-w-md  p-6 rounded-lg text-center">
                    <span
                        className={cn("icon-[ph--check-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl")}
                    ></span>
                    <h2 className="text-2xl font-semibold">OTP Validated!</h2>
                    <p className="text-lg mt-2 text-paragraph">Your OTP is valid, and your card has been successfully created.</p>
                </div>
            </div>
        </>
    );
}