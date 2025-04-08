import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/__utils__/theme-provider.tsx";
import {AppRoutes} from "./router/routes";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </QueryClientProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
