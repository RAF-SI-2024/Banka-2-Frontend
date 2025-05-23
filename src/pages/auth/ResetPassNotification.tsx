import ResetNotification from "@/components/auth/password-reset/ResetNotification.tsx";

export default function ResetPasswordNotificationPage() {

  return (
    <>

          <div className="flex flex-col justify-center items-center w-full gap-2 z-10 ">
              <div className="z-10 ">
                <ResetNotification className="max-w-xl z-10 "/>
              </div>
          </div>
    </>
  );
}
