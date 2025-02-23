import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext"; // Auth Context for managing authentication
import { ThemeProvider } from "@/components/utils/theme-provider.tsx";
import AppRoutes from "./router/routes"; //Routes are handled in a separate file

function App() {
    return (
        <AuthProvider> {/* Wraps authentication context */}
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> {/* Wraps theme provider */}
                <BrowserRouter>
                    <AppRoutes /> {/* Handles routes separately */}
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
