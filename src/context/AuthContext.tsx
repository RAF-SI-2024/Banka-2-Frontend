import { createContext, useEffect, useState, ReactNode } from "react";
import { setAuthToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";
// import { UserData } from "@/types/user";

interface AuthContextType {
    user: { id: string; role: string } | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("✅ AuthProvider is wrapping the app!");

    const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
    const [user, setUser] = useState<{ id: string; role: string } | null>(
        token ? JSON.parse(sessionStorage.getItem("user") || "null") : null
    );

    // Restore user from sessionStorage when app starts
    useEffect(() => {
        if (token && !user) {
            try {
                console.log("🔄 Restoring user from token...");
                setAuthToken(token);
                const decodedToken: any = jwtDecode(token);
                const userData = {
                    id: decodedToken.sub,
                    role: decodedToken.permissions || [],
                };
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
                console.error("❌ Invalid token:", error);
                logout();
            }
        }
    }, [token]); // Runs only when token changes !!!

    const login = (token: string) => {
        try {
            const decodedToken: any = jwtDecode(token);
            const userData = {
                id: decodedToken.id,
                role: decodedToken.role || [],
            };

            setToken(token);
            setUser(userData);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(userData));
            setAuthToken(token);
        } catch (error) {
            console.error("❌ Error decoding token during login:", error);
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setAuthToken(null);
        console.log("User logged out!");

    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
