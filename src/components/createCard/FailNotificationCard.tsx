import {cn} from "@/lib/utils.ts";
import * as React from "react";

export default function FailNotificationCard(){

    return (
        <>
            <div className="flex justify-start ">
                <div className="w-full max-w-md  p-6 rounded-lg text-center">
                    <span
                        className={cn("icon-[ph--x-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl")}
                    ></span>
                    <h2 className="text-2xl font-semibold">OTP not valid!</h2>
                    <p className="text-lg mt-2 text-paragraph">Your OTP is invalid, and your card could not be created.</p>
                </div>
            </div>
        </>
    );
}