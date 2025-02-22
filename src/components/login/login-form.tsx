import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import * as React from "react";
import {useState} from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>

        <CardContent className="mt-4">
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" size="tight" className="ml-auto">Forgot your password?</Button>
                </div>

                <div className="relative">

                  <Input id="password" type={isVisible ? "text" : "password"} placeholder="********" required />

                  <Button type="button" variant="ghost" size="icon" onClick={toggleVisibility}
                          className="absolute inset-y-0 end-0">
                    {isVisible ? (
                        <span className="icon-[ph--eye]" />
                    ) : (
                      <span className="icon-[ph--eye-closed]" />
                    )}
                  </Button>
                </div>

              </div>

              <Button type="submit" variant="gradient" className="w-full">
                Log in
              </Button>


            </div>

          </form>
        </CardContent>

      </Card>
    </div>
  )
}
