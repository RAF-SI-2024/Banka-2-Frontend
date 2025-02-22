import { LoginForm } from '@/components/login/login-form.tsx'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Footer} from "@/components/common/footer.tsx";
import { ThemeProvider } from "@/components/utils/theme-provider.tsx"
import { Particles } from "@/components/common/particles.tsx";
import logo from "assets/img/logo.png"
import Logo from "@/components/common/logo.tsx";

export default function LoginPage() {
    return(
        <>
            <div className="max-w-full min-h-dvh justify-between flex flex-initial flex-col m-0 p-0 gap-0 relative">
                <header
                    className="flex px-4 self-stretch h-16 items-center  font-paragraph z-50 relative bg-background">
                    <nav className="flex justify-between items-center w-full h-full">
                        {/*<Label className="font-display text-3xl my-4">*/}
                        {/*    BankToo*/}
                        {/*</Label>*/}
                        <a href="#" className="my-4 h-full">
                        <Logo className="size-full hover:animate-pulse"></Logo>
                        </a>

                        <Button type="button" variant="gradient">
                            Sign Up
                        </Button>
                    </nav>
                </header>
                <main>
                    <Particles className="absolute inset-0 pointer-events-none z-10 mix-blend-hard-light" quantity={8}/>
                    <div className="flex flex-col justify-center items-center self-center w-full gap-4 relative">
                        <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative">
                            Log in to BankToo</h1>
                        <div className="w-full max-w-sm z-10 relative">
                            <LoginForm/>
                        </div>
                    </div>
                </main>
                <div
                    className="flex justify-center self-stretch h-16 items-center border-t border-b border-border font-paragraph bg-background z-50">
                    <p className="text-p">
                        Don&apos;t have an account?{" "}
                        <a href="#" className="text-link underline-offset-4 hover:underline hover:text-link-hover">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
            <div className="z-10 relative">
                <Footer/>
            </div>
        </>
    )
}