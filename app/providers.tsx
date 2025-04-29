"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { toast } from "sonner";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

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
                  name: "Example User",
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
      {children}
    </DynamicContextProvider>
  );
}

function extractAccountDataFromJWT(jwt: any) {
  const userId = jwt.sub;
  const email = jwt.email;
  const blockchainCred = jwt.verified_credentials.find(
    (c: any) => c.format === "blockchain"
  );
  const emailCred = jwt.verified_credentials.find(
    (c: any) => c.format === "email"
  );
  const oauthCred = jwt.verified_credentials.find(
    (c: any) => c.format === "oauth"
  );

  return {
    user_id: userId,
    email: emailCred?.email || email,
    primary_address: blockchainCred?.address,
    name: oauthCred?.oauth_display_name || oauthCred?.oauth_username,
    profile_image: oauthCred?.oauth_account_photos?.[0] || null,
    // add other fields as needed
  };
}
