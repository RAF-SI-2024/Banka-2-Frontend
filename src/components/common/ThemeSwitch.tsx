import { useTheme } from "@/components/utils/theme-provider.tsx"
import { Button, buttonVariants } from "@/components/ui/button.tsx"
import { VariantProps } from "class-variance-authority";
import { useState } from "react";

type ButtonVariantType = VariantProps<typeof buttonVariants>["variant"];

interface ThemeSwitchProps {
    variant?: ButtonVariantType;
    className?: string;
}

export function ThemeSwitch({ variant = "ghost", className="fixed mr-4"}: ThemeSwitchProps) {
    const { setTheme, theme } = useTheme();
    const [rotating, setRotating] = useState(false);

    const handleClick = () => {
        setRotating(true);
        setTheme(theme === "light" ? "dark" : "light");
        setTimeout(() => setRotating(false), 300); // Ensure the rotation resets
    };

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={handleClick}
            className={`${className} right-1 transition-transform duration-300 ${rotating ? "rotate-180" : ""}`}
        >
            <span className="icon-[ph--sun] h-[1.5rem] w-[1.3rem] dark:hidden transition-opacity duration-300" />
            <span className="icon-[ph--moon] hidden h-5 w-5 dark:block transition-opacity duration-300" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
