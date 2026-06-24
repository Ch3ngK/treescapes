import React from "react";
import { createContext, useContext, useState } from "react";

type AuthContextValue = {
    token: string | null; 
    signIn: (token: string) => void; 
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    
    function signIn(nextToken: string) {
        setToken(nextToken);
    }

    function signOut() {
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}