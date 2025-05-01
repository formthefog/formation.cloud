"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { toast } from "sonner";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { AuthProvider } from "@/components/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        displaySiweStatement: true,
        appName: "Formation",
        appLogoUrl: "/logo.png",
        events: {
          onAuthSuccess: async ({ user, primaryWallet }) => {
            try {
              console.log("Auth success", user, primaryWallet);
              const token = await getAuthToken();

              console.log("Token", token);

              if (!token) {
                throw new Error("No authentication token found");
              }

              // Make API call to your backend to create/update account
              const response = await fetch("/api/account/create", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_id: user.userId,
                  email: user?.email,
                  address: primaryWallet?.address,
                  name: user.firstName || user.lastName || "--",
                  provider_account_id: user.userId,
                  access_token: token,
                  refresh_token: token,
                  expires_at: 1000000000,
                  token_type: "Bearer",
                  scope: "read:user,user:email",
                }),
              });

              if (!response.ok) {
                throw new Error("Failed to create account");
              }

              toast.success("Account created successfully!");
            } catch (error) {
              console.error("Error creating account:", error);
              toast.error("Failed to create account. Please try again.");
            }
          },
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </DynamicContextProvider>
  );
}
