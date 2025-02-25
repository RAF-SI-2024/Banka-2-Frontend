import { createContext, useEffect, useState, ReactNode } from "react";
import { setAuthToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { UserData } from "@/types/user";

interface AuthContextType {
    user: { email: string; permissions: string[] } | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("✅ AuthProvider is wrapping the app!");

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<{ email: string; permissions: string[] } | null>(
        token ? JSON.parse(localStorage.getItem("user") || "null") : null
    );

    // Restore user from localStorage when app starts
    useEffect(() => {
        if (token && !user) {
            try {
                console.log("🔄 Restoring user from token...");
                setAuthToken(token);
                const decodedToken: any = jwtDecode(token);
                const userData = {
                    email: decodedToken.sub,
                    permissions: decodedToken.permissions || [],
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
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
                email: decodedToken.sub,
                permissions: decodedToken.permissions || [],
            };

            setToken(token);
            setUser(userData);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setAuthToken(token);
        } catch (error) {
            console.error("❌ Error decoding token during login:", error);
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
