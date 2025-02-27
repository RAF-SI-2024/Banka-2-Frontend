import {Button} from "@/components/ui/button.tsx";
import Footer from "@/components/common/Footer.tsx";
import { Particles } from "@/components/common/Particles.tsx";
import {BottomBar} from "@/components/common/BottomBar.tsx";
import * as React from "react";
import HeaderWithLogo from "@/components/common/header/HeaderWithLogo.tsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

export default function AuthorizationLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine which button to show in the Header
    let headerButton;

    if (location.pathname === "/register" || location.pathname === "/activate") {
        headerButton = (
            <Button type="button" variant="gradient_outline" onClick={() => navigate("/login")}>
                Log In
            </Button>
        );
    } else if (location.pathname === "/login") {
        headerButton = (
            <Button type="button" variant="gradient" onClick={() => navigate("/register")}>
                Sign Up
            </Button>
        );
    }
    else{
        headerButton = (
            <div className="flex flex-row gap-2">
                <Button type="button" variant="gradient_outline" onClick={() => navigate("/login")}>
                    Log In
                </Button>
                <Button type="button" variant="gradient" onClick={() => navigate("/register")}>
                    Sign Up
                </Button>
            </div>
        );
    }

    // Determine what to show in the BottomBar
    let bottomBar = (<div></div>);

    if (location.pathname === "/register" || location.pathname === "/password-reset") {
        bottomBar = (
            <BottomBar className="relative z-50">
                    <p className="text-p">
                        Have an account already?{" "}
                        <Button variant="link" size="tight" className="text-base" onClick={() => navigate("/login")}>
                            Log in
                        </Button>
                    </p>
            </BottomBar>
        )
    } else if (location.pathname === "/login") {
        bottomBar = (
            <BottomBar className="relative z-50">
                <p className="text-p">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" size="tight" className="text-base" onClick={() => navigate("/register")}>
                        Sign up
                    </Button>
                </p>
            </BottomBar>
        );
    }

    return(
        <>
            {/*Header, main part and login fit the screen*/}
            <div className="max-w-full min-h-dvh justify-between flex flex-initial flex-col m-0 p-0 gap-0 relative">
                {/*z and relative to make Header in front of particles*/}
                <HeaderWithLogo className="z-50 relative">
                    {headerButton}
                </HeaderWithLogo>

                <main>
                    {/*absolute so that they overlap with other parts of the page,
                    z is set as well. mix = blending mode hard light for cooler effect*/}
                    <Particles className="absolute inset-0 pointer-events-none z-10 mix-blend-hard-light" quantity={8}/>

                    {/*Log in text - behind the particles*/}
                    <Outlet />

                </main>

                {/*bottom bar - in front of the particles*/}
                {bottomBar}

            </div>

            {/*footer - in front of the particles*/}

            <Footer className="z-10 relative"/>

        </>
    )
}