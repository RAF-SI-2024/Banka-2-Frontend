import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export default function ResetNotification({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center size-full",
          className
        )}
        {...props}
      >
        <CardContent className="mt-6 font-paragraph text-center">
          <div className="w-22 h-22 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto">
            <CheckIcon className="w-20 h-15 text-card stroke-3" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-heading">
              Password reset email has been sent!
            </h2>
            <div className="mx-6">
              <p className="text-muted-foreground text-left">
                We've sent a password reset link to your email. Please check
                your inbox (and spam folder) and follow the instructions to
                reset your password.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-0">
            <div className="flex items-center">
              <p className="text-muted-foreground text-sm">
                Didn’t receive the email?
              </p>
              <Button
                variant="link"
                className="text-primary text-sm"
                onClick={() => console.log("Resend password reset email")}
              >
                Resend password reset email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
