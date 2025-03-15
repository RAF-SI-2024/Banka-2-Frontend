import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps, toast } from "sonner"

const variantClassNames = {
    default: {
        toast:
            "!text-xl !font-bold !font-paragraph !group toast group-[.toaster]:bg-background !group-[.toaster]:text-foreground !group-[.toaster]:border-border !group-[.toaster]:shadow-lg",
        description: "!text-sm !font-thin !font-paragraph !group-[.toast]:text-muted-foreground",
        actionButton:
            "!group-[.toast]:bg-primary !group-[.toast]:text-primary-foreground !font-medium ",
        cancelButton:
            "!group-[.toast]:bg-muted !group-[.toast]:text-muted-foreground !font-medium",
    },
    success: {
        toast: "!text-xl !font-bold !bg-success !text-success-foreground !font-paragraph !border-success/90",
        description: "!text-sm !font-thin !text-success-foreground !font-paragraph ",
    },
    error: {
        toast: "!text-xl !font-bold  !bg-destructive !text-destructive-foreground !border-destructive/90",
        description: "!text-sm !font-thin !text-destructive-foreground !font-paragraph ",
    },
    warning: {
        toast: "!text-xl !font-bold !bg-yellow-500 !text-white !border-yellow-600",
        description: "!text-sm !font-thin !text-white !font-paragraph ",
    },
    info: {
        toast: "!text-xl !font-bold !bg-primary !text-white !border-primary/90",
        description: "!text-sm !font-thin !text-white !font-paragraph ",
    },
}

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            {...props}
        />
    )
}

interface ToastProps {
    title?: string,
    description?: string,
    variant?: keyof typeof variantClassNames
    icon?: React.ReactNode
}
export const showToast = ({
                              title,
                              description,
                              variant = "default",
                              icon,
                          }: ToastProps) => {

    toast(title, {
        description,
        classNames: variantClassNames[variant] || variantClassNames["default"],
        icon,
    })
}
export { Toaster }
