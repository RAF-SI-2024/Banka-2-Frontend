import { useNavigate } from "react-router-dom";
import HeaderWithLogo from "@/components/common/header/HeaderWithLogo.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Particles } from "@/components/common/Particles.tsx";
import Footer from "@/components/common/Footer.tsx";
import ResetNotification from "@/components/passwordReset/ResetNotification.tsx";

export default function ResetPasswordNotificationPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-full min-h-dvh justify-between flex flex-initial flex-col m-0 p-0 gap-0 relative">
        <HeaderWithLogo className="z-50 relative">
          <Button
            type="button"
            variant="gradient"
            onClick={() => {
              navigate("/register", { replace: true });
            }}
          >
            Sign Up
          </Button>
        </HeaderWithLogo>
        <main className="flex justify-center items-center min-h-screen">
          <Particles
            className="absolute inset-0 pointer-events-none z-10 mix-blend-hard-light"
            quantity={8}
          />

          <div className="flex flex-col justify-center items-center self-center w-full gap-2">
            <div className="w-full max-w-sm z-10 relative">
              <ResetNotification />
            </div>
          </div>
        </main>
      </div>

      <Footer className="z-10 relative" />
    </>
  );
}
