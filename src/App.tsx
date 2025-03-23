import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/__utils__/theme-provider.tsx";
import {AppRoutes} from "./router/routes";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
