import { ThemeProvider } from "@/components/utils/theme-provider.tsx"
import LoginPage from "@/pages/Login.tsx"
import HomePage from "@/pages/Home.tsx"
import ComponentShowcasePage from "@/pages/ComponentShowcase.tsx"



function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {
                <>
                    {/*<ComponentShowcasePage></ComponentShowcasePage>*/}
                    <ComponentShowcasePage/>
                    {/*<LoginPage/>*/}

                </>
            }</ThemeProvider>
    )
}

export default App
