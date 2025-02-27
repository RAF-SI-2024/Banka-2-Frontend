import {cn} from "@/lib/utils.ts";
import React from "react";

// Explicitly define icon classes to avoid issues with Tailwind's PurgeCSS
const numberIcons: Record<number, string> = {
    1: "icon-[ph--number-circle-one-fill]",
    2: "icon-[ph--number-circle-two-fill]",
    3: "icon-[ph--number-circle-three-fill]",
    4: "icon-[ph--number-circle-four-fill]",
    5: "icon-[ph--number-circle-five-fill]",
    6: "icon-[ph--number-circle-six-fill]",
    7: "icon-[ph--number-circle-seven-fill]",
    8: "icon-[ph--number-circle-eight-fill]",
    9: "icon-[ph--number-circle-nine-fill]",
};




interface StepperProps extends React.ComponentProps<"div"> {
    totalSteps: number; // total number of steps
    currentStep: number; // current step number (starting from 1)
    iconProps?: React.ComponentProps<"span">;  // props of the icon's span
    iconClassName?: string; // span's className
    lineProps?: React.ComponentProps<"hr">; // props of the line separator
    lineClassName?: string; // line separator's className
    color1?: string; // Finished color
    color2?: string; // Transition color
    color3?: string; // Unfinished color
}


export default function Stepper ({
    totalSteps = 4,
    currentStep = 2,
    iconProps = {},
    iconClassName = "",
    lineProps = {},
    lineClassName = "",
    ...props} : StepperProps) {

    const currentStepColor = `inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover`
    const finishedColor = `text-primary`
    const unfinishedColor = `text-background`

    const currentLineColor = `bg-gradient-to-r from-secondary to-background`
    const finishedLineColor = `bg-primary`
    const unfinishedLineColor = `bg-background`


    return (
        <div className="flex flex-row" {...props}>
            {Array.from({ length: totalSteps }).map((_, i) => (
                // <div key={i} className="">
                <div key={i} className="flex flex-col">

                    <div className="flex flex-row items-center justify-center">
                        {/* Icon with proper sizing and no extra spacing */}
                        <span
                            className={cn(
                                "flex items-center justify-center shrink-0 size-12 m-0 leading-0 p-0", // Ensures the icon stays its size
                                i + 1 === currentStep ? currentStepColor : i < currentStep ? finishedColor : unfinishedColor,
                                i === totalSteps - 1 ? "icon-[ph--check-circle-fill]" : `${numberIcons[i + 1]}`, iconClassName
                            )}
                            {...iconProps}
                        />

                        {/* Line that connects the steps */}
                        {i !== totalSteps - 1 && (
                            <hr
                                className={cn(
                                    "flex-grow h-1 border-0 w-12  -mx-1.5", // Makes the line fill the remaining space
                                    i + 1 === currentStep ? currentLineColor : i < currentStep ? finishedLineColor : unfinishedLineColor,
                                    lineClassName
                                )}
                                {...lineProps}
                            />
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export { Stepper }