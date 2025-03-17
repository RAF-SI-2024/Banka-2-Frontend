import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext"; // Auth Context for managing authentication
import { ThemeProvider } from "@/components/utils/theme-provider.tsx";
import {AppRoutes} from "./router/routes";
import {DataProvider} from "@/context/TransactionCodes.tsx"; //Routes are handled in a separate file

function App() {
    return (
        <AuthProvider> {/* Wraps authentication context */}
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> {/* Wraps theme provider */}
                <DataProvider defaultData="" storageKey="vite-ui-data"> {/* Wraps DataProvider for your data */}
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </DataProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
