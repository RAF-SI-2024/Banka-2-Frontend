import * as React from "react";
import EmailConfirmation from "@/components/__common__/EmailConfirmation.tsx";
import {useNavigate} from "react-router-dom";

export default function ResetNotification({
  ...props
}: React.ComponentProps<"div">) {

    const [secondsLeft, setSecondsLeft] = React.useState(10);
    const [isDisabled, setIsDisabled] = React.useState(true);
    const navigate = useNavigate();

    const handleResendClick = () => {
        navigate("/password-reset");
    };

    React.useEffect(() => {

        if (secondsLeft > 0) {
            const timer = setTimeout(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsDisabled(false);
        }
    }, [secondsLeft]);

  return (
      <EmailConfirmation title="Password reset email has been sent!"
      description="We've sent a password reset link to your email. Please check
                your inbox (and spam folder) and follow the instructions to
                reset your password."
      resendQuestion="Didn't receive the email?"
      resendUrlText={isDisabled ? `Resend in ${secondsLeft}s` : "Resend activation mail"}
      onUrlClick={isDisabled ? undefined : handleResendClick}
      ></EmailConfirmation>
  );
}
