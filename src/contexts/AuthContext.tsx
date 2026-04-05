import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";

interface User {
  id: string;
  role: "company" | "applicant";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    const refreshUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.warn("Auth check failed:", err);
        // ❗ Do NOT force logout immediately
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      refreshUser();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, loading, refreshUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};