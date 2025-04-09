import React from "react";

interface ErrorFallbackProps {
    message: string;
}
export default function ErrorFallback({message} : ErrorFallbackProps){
    return (
        <h1 className="text-center text-2xl font-semibold text-destructive">
            {message}
        </h1>
    );
}