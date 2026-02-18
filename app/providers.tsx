"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { toast } from "sonner";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { AuthProvider } from "@/components/auth-provider";
import { jwtDecode } from "@/lib/utils";
import { useEffect, Suspense } from "react";
import { GTMRouteTracker } from "@/components/GTMRouteTracker";
import { captureUTM } from "@/lib/utm";
import { pushDataLayer } from "@/lib/gtm";

function UTMCapture() {
  useEffect(() => {
    const utm = captureUTM();
    if (utm) {
      pushDataLayer({ event: "utm_captured", ...utm });
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UTMCapture />
      <Suspense>
        <GTMRouteTracker />
      </Suspense>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
          walletConnectors: [EthereumWalletConnectors],
          displaySiweStatement: true,
          appName: "Formation",
          appLogoUrl: "/logo.png",
          events: {
            onAuthSuccess: async ({ user, primaryWallet, handleLogOut }) => {
              try {
                console.log("Auth success", user, primaryWallet);
                const token = getAuthToken();

                console.log("Token", token, user);

                if (!token) {
                  throw new Error("No authentication token found");
                }

                const response = await fetch("/api/account/create", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: user?.email,
                    address: primaryWallet?.address,
                    name: user.firstName || user.lastName || "--",
                    access_token: token,
                    refresh_token: token,
                    dynamic_id: user.userId,
                    expires_at: 1000000000,
                    token_type: "Bearer",
                    scope: "read:user,user:email",
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to create account");
                }

                const { getFirstTouchUTM } = await import("@/lib/utm");
                pushDataLayer({
                  event: "sign_in_success",
                  user_id: user.userId,
                  auth_method: primaryWallet ? "wallet" : "email",
                  ...getFirstTouchUTM(),
                });

                toast.success("Account created successfully!");
              } catch (error) {
                console.error("Error creating account:", error);
                pushDataLayer({ event: "sign_in_error" });
                toast.error("Failed to create account. Please try again.");
                handleLogOut();
              }
            },
          },
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </DynamicContextProvider>
    </>
  );
}
