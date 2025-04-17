import { createContext, useEffect, useState, ReactNode } from "react";
import { setAuthToken } from "../api/axios.ts";
import { User } from "@/types/bank_user/user.ts";
import { setGlobalLogout } from "@/types/bank_user/auth.ts";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("✅ AuthProvider is wrapping the app!");

    const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(
        token ? JSON.parse(sessionStorage.getItem("user") || "null") : null
    );

    useEffect(() => {
        if (token && !user) {
            try {
                console.log("🔄 Restoring user from session storage...");
                setAuthToken(token);
                const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");

                if (storedUser) {
                    setUser(storedUser);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("❌ Error restoring user:", error);
                logout();
            }
        }
    }, [token]);

    const login = (token: string, userData: User) => {
        try {
            setToken(token);
            setUser(userData);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(userData));
            setAuthToken(token);
        } catch (error) {
            console.error("❌ Error storing login session:", error);
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        // localStorage.removeItem("accountId");
        // localStorage.removeItem("cardTypes");
        // localStorage.removeItem("currencies");
        setAuthToken(null);
        console.log("🚪 User logged out!");
        window.location.href = "/login"; // Force redirect to login
    };

    setGlobalLogout(logout);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
