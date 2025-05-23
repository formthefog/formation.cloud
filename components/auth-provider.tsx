import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Account } from "@/types/account";

export interface AuthContextType {
  user: any; // You can type this more strictly if you have a user type
  account: Account | null;
  loading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, handleLogOut } = useDynamicContext();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts for the current user
  const fetchAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        setAccount(null);
        setError("No auth token");
        setLoading(false);
        return;
      }
      const response = await fetch("/api/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to fetch account");
        setAccount(null);
        handleLogOut();
      } else {
        const data = await response.json();
        setAccount(data);
        console.log("Account", data);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch accounts when user changes
  useEffect(() => {
    if (user) {
      fetchAccount();
    } else {
      setAccount(null);
    }
  }, [user, fetchAccount]);

  const value: AuthContextType = {
    user,
    account,
    loading,
    error,
    refreshAccount: fetchAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
