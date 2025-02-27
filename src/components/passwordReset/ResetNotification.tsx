import * as React from "react";
import {Card, CardContent, CardDescription} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ResetNotification({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (
      <div className="flex flex-col justify-center items-center w-full gap-2 z-10 max-width-full">
        <Card className={cn("w-xl z-10  flex flex-col gap-6", className)} {...props}>
          <CardContent  className="mt-4 font-paragraph flex flex-col items-center text-center gap-3">
          <span
              className="icon-[ph--check-circle-fill] inset-0 bg-gradient-to-r from-primary to-secondary mask-size-cover text-8xl"></span>

            <h2 className="text-2xl font-heading">
              Password reset email has been sent!
            </h2>

            <CardDescription className="flex flex-col gap-4">
              <p className="text-paragraph">
                We've sent a password reset link to your email. Please check
                your inbox (and spam folder) and follow the instructions to
                reset your password.
              </p>

              <p className="text-paragraph text-sm">
                Didn&apos;t receive the email?{" "}
                <Button
                    variant="link"
                    size="tight"
                    className="ml-auto"
                >
                  Resend password reset email
                </Button>
              </p>
            </CardDescription>

          </CardContent>
        </Card>
      </div>
        );
        }
