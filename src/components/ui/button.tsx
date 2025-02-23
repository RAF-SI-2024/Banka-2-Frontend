import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {ReactNode} from "react";

const sizeClasses = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  tight: "m-0 p-0"
};


const constantProps = "font-paragraph font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm " +
    "transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none " +
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring dark:ring-ring dark:outline-ring/40 " +
    "outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 cursor-pointer"

const buttonVariants = cva(
    constantProps,
  {
    variants: {
      variant: {
        default:
          "border-transparent border bg-foreground text-background shadow-sm hover:border hover:border-border hover:bg-foreground/70",
        negative:
            "border-transparent border bg-background text-foreground shadow-sm hover:border hover:border-border hover:bg-background/70",
        destructive:
          "border-transparent border bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/70 hover:border hover:border-border",
        outline:
          "border border-input border-foreground bg-background text-foreground shadow-xs hover:bg-foreground hover:text-background",
        primary:
            "border-transparent border bg-primary text-white shadow-xs hover:bg-primary/70 hover:border hover:border-border",
        secondary:
          "border-transparent border bg-secondary text-white shadow-xs hover:bg-secondary/70 hover:border hover:border-border",
        ghost: "hover:text-link-hover",
        link: "underline-offset-4 hover:underline text-link hover:text-link-hover ",
        gradient:
          "text-white shadow-sm bg-gradient-to-r from-primary to-secondary hover:bg-transparent",
        gradient_outline:
          "text-white shadow-sm bg-gradient-to-r from-primary to-secondary ",
      },
      size: sizeClasses
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const innerGradientStyle = {
  gradient_outline:
      "flex h-full w-full hover:border-transparent items-center justify-center text-foreground hover:text-white hover:bg-transparent bg-background",
  gradient:
      "flex hover:border-transparent h-full w-full items-center justify-center transition hover:bg-background hover:text-foreground duration-200 text-white bg-transparent"
};




function Button({
  children = [],
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  if (variant=="gradient" || variant=="gradient_outline"){

    const new_size= size!=="icon"? "h-9 p-px rounded-md": "size-9 p-px rounded-md"
    const inner_padding = size!=="icon"? "px-4 py-2": 'px-4 py-4'

    const mappedSize = sizeClasses[size ?? "default"]
    const style = innerGradientStyle[variant ?? "gradient"]

    const inner_format = `${mappedSize} ${constantProps} ${inner_padding} ${style}`;
    return(
    <Comp
        data-slot="button"

        className={cn(buttonVariants({ variant, className }), new_size)}

        {...props}>

      <div className={inner_format}>
        {children}
      </div>

    </Comp>
    )
  }
  // if(variant=="gradient"){
  //   const new_size= size!=="icon"? "h-9 p-px rounded-md": "size-9 p-px rounded-md"
  //   const mappedSize = sizeClasses[size ?? "default"];
  //   const inner_padding = size!=="icon"? "px-4 py-2": 'px-4 py-4'
  //   const inner_format = `${mappedSize} ${inner_padding} flex hover:border-transparent h-full w-full items-center justify-center transition hover:bg-background duration-200 text-white bg-transparent`
  //
  //   return(
  //       <Comp
  //           data-slot="button"
  //
  //           className={cn(buttonVariants({ variant, className }), new_size)}
  //
  //           {...props}>
  //
  //         <div className={inner_format}>
  //           {children}
  //         </div>
  //
  //       </Comp>
  //   )
  // }
  return (

    <Comp
      data-slot="button"

      className={cn(buttonVariants({ variant, size, className, }))}

      {...props}>
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
