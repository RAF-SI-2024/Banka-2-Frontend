import { LoginForm } from '@/components/login/login-form.tsx'
import {Button} from "@/components/ui/button";
import Footer from "@/components/common/footer.tsx";
import { Particles } from "@/components/common/particles.tsx";
import {BottomBar} from "@/components/common/bottom-bar.tsx";
import * as React from "react";
import HeaderWithLogo from "@/components/common/header/header-with-logo.tsx";

export default function LoginPage() {
    return(
        <>
            {/*Header, main part and login fit the screen*/}
            <div className="max-w-full min-h-dvh justify-between flex flex-initial flex-col m-0 p-0 gap-0 relative">
                {/*z and relative to make Header in front of particles*/}
                <HeaderWithLogo className="z-50 relative">
                    <Button type="button" variant="gradient">
                        Sign Up
                    </Button>
                </HeaderWithLogo>

                <main>
                    {/*absolute so that they overlap with other parts of the page,
                    z is set as well. mix = blending mode hard light for cooler effect*/}
                    <Particles className="absolute inset-0 pointer-events-none z-10 mix-blend-hard-light" quantity={8}/>

                    {/*put the card and text in the center of the page, gap-2 for spacing between text and card*/}
                    <div className="flex flex-col justify-center items-center self-center w-full gap-2">
                        {/*Log in text - behind the particles*/}
                        <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                            Log in to BankToo</h1>
                        {/*Log in form/card - in front of the parrticles*/}
                        <div className="w-full max-w-sm z-10 relative">
                            <LoginForm/>
                        </div>
                    </div>
                </main>

                {/*bottom bar - in front of the particles*/}
                <BottomBar className="relative z-50">
                    <p className="text-p">
                        Don&apos;t have an account?{" "}
                        <Button variant="link" size="tight" className="text-base">
                            Sign up
                        </Button>
                    </p>
                </BottomBar>
            </div>

            {/*footer - in front of the particles*/}

            <Footer className="z-10 relative"/>

        </>
    )
}