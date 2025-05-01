import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";

// Define Account and User types (customize as needed)
export interface Account {
  id: string;
  user_id: string;
  primary_address: string;
  created_at: string;
  type: string;
  provider: string;
  provider_account_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: any; // You can type this more strictly if you have a user type
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useDynamicContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts for the current user
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        setAccounts([]);
        setError("No auth token");
        setLoading(false);
        return;
      }
      const response = await fetch("/api/account/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to fetch accounts");
        setAccounts([]);
      } else {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch accounts when user changes
  useEffect(() => {
    if (user) {
      fetchAccounts();
    } else {
      setAccounts([]);
    }
  }, [user, fetchAccounts]);

  const value: AuthContextType = {
    user,
    accounts,
    loading,
    error,
    refreshAccounts: fetchAccounts,
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
