import * as React from "react";
import EmailConfirmation from "@/components/common/EmailConfirmation.tsx";

export default function ResetNotification({
  ...props
}: React.ComponentProps<"div">) {

  return (
      <EmailConfirmation title="Password reset email has been sent!"
      description="We've sent a password reset link to your email. Please check
                your inbox (and spam folder) and follow the instructions to
                reset your password."
      resendQuestion="Didn't receive the email?"
      resendUrlText="Resend activation mail" {...props}
      onUrlClick={() => alert("Email je ponovo poslat!")}
      ></EmailConfirmation>
  );
}
