import {showToast} from "@/components/ui/sonner.tsx";
import React from "react";
import {AxiosError} from "axios";

interface ShowErrorToastProps {
    defaultTitle?: string,
    error?: Error | unknown | null,
    defaultMessage?: string,
}

export function showErrorToast({
                              defaultTitle="Error",
                              error,
                              defaultMessage ="Request failed"
}:ShowErrorToastProps) {


    if (error instanceof AxiosError) {
        // Loop through each error field in the response data
        const errors = (error?.response?.data?.errors ?? {}) as Record<string, string[] | string>;

        if (Object.keys(errors).length === 0) {
            showToast({
                title: defaultTitle,
                variant: "error",
                description: error.message ?? defaultMessage,
                icon: <span className="icon-[ph--x-circle] text-destructive-foreground text-xl"></span>
            });
        }

        Object.entries(errors).forEach(([key, messages]) => {
            const errorMessages = Array.isArray(messages) ? messages : [messages];

            errorMessages.forEach((message: string) => {
                showToast({
                    title: `Error in ${key}`,
                    variant: "error",
                    description: message,
                    icon: <span className="icon-[ph--x-circle] text-destructive-foreground text-xl"></span>
                });
            });
        });
    } else {
        showToast({
            title:defaultTitle,
            variant:"error",
            description: defaultMessage,
            icon: <span className="icon-[ph--x-circle] text-destructive-foreground text-xl"></span>
        });
    }
}

export function showSuccessToast({
                                     title="Success!",
                                     description="Request completed successfully.",
                                 }){
    showToast({
        title:title,
        variant:"success",
        description: description,
        icon: <span className="icon-[ph--check-circle] text-background text-xl"></span>
    });
}