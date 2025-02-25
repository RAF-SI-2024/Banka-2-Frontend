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
    totalSteps: number;
    currentStep: number;
    iconProps?: React.ComponentProps<"span">;
    iconClassName?: string;
    lineProps?: React.ComponentProps<"hr">;
    lineClassName?: string;
    color1?: string;
    color2?: string;
    color3?: string;
    color4?: string;
}


export default function Stepper ({
    totalSteps = 4,
    currentStep = 2,
    iconProps = {},
    iconClassName = "",
    lineProps = {},
    lineClassName = "",
    color1 = "primary",
    color2 = "secondary",
    color3 = "background",
    ...props} : StepperProps) {

    const currentStepColor = `inset-0 bg-gradient-to-r from-${color1} to-${color2} mask-size-cover`
    const finishedColor = `text-${color1}`
    const unfinishedColor = `text-${color3}`

    const currentLineColor = `bg-gradient-to-r from-${color2} to-${color3}`
    const finishedLineColor = `bg-${color1}`
    const unfinishedLineColor = `bg-${color3}`


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
