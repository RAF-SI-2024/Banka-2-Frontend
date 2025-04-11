// ErrorAlert.tsx
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";

interface ErrorAlertProps {
    title?: string;
    description?: string;
    onClose: () => void;
}

export function ErrorAlert({ title = "Error", description = "", onClose }: ErrorAlertProps) {
    return (
        <Alert variant="destructive" className="relative flex items-center p-4 gap-2">
            {/* Icon */}
            <span className="icon-[ph--warning-circle] size-6 flex-shrink-0" />

            {/* Text Content */}
            <div className="min-w-0">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    <p className="truncate w-full">
                        {description}
                    </p>
                </AlertDescription>
            </div>

            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-2 right-2"
            >
                <span className="icon-[ph--x] size-4 text-destructive"></span>
            </Button>
        </Alert>
    );
}
