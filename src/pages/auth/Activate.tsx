import RegisterPasswordForm from "@/components/register/RegisterPasswordForm.tsx"

import * as React from "react"

export default function ActivatePage() {
  return (
    <>
          {/*put the card and text in the center of the page, gap-2 for spacing between text and card*/}
          <div className="flex flex-col justify-center items-center self-center w-full gap-2">
            {/*Log in text - behind the particles*/}
            <h1 className="text-5xl font-heading tracking-tight z-0 relative">
              Just one more step...
            </h1>
            {/*Log in form/card - in front of the parrticles*/}
            <div className="w-full max-w-sm z-10 relative">
              <RegisterPasswordForm />
            </div>
          </div>
    </>
  )
}
