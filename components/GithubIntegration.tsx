import { useEffect, useState } from "react";
import { getAuthToken, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GitHubIntegration {
  id: string;
  repository_name: string;
  repository_url: string;
  branch: string;
  status: string;
  created_at: string;
}

export function GitHubIntegration() {
  const { user, primaryWallet } = useDynamicContext();
  const [integrations, setIntegrations] = useState<GitHubIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  async function loadIntegrations() {
    try {
      const token = getAuthToken();
      const response = await fetch("/api/github/integrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load integrations");

      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to load integrations:", error);
      toast.error("Failed to load GitHub integrations");
    } finally {
      setLoading(false);
    }
  }

  const handleConnectGitHub = async () => {
    try {
      setIsConnecting(true);

      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem("github_oauth_state", state);
      const token = getAuthToken();

      // Get the GitHub OAuth URL
      const response = await fetch("/api/github/auth-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wallet_address: primaryWallet?.address,
          state,
        }),
      });

      if (!response.ok) throw new Error("Failed to get GitHub auth URL");

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to initiate GitHub connection:", error);
      toast.error("Failed to connect to GitHub");
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.verifiedCredentials) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-4">
          Please verify your credentials first
        </h3>
        <p className="text-gray-500">
          You need to verify your account before connecting to GitHub.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">GitHub Integrations</h2>
        <Button
          onClick={handleConnectGitHub}
          disabled={isConnecting}
          className="bg-[#24292F] hover:bg-[#24292F]/90 text-white"
        >
          {isConnecting ? (
            "Connecting..."
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Connect GitHub
            </>
          )}
        </Button>
      </div>

      {integrations.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Active Integrations</h3>
          </div>
          <div className="divide-y">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {integration.repository_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Branch: {integration.branch}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(integration.repository_url, "_blank")
                      }
                    >
                      View Repository
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">No GitHub Integrations</h3>
          <p className="text-gray-500">
            Connect your GitHub account to get started.
          </p>
        </div>
      )}
    </div>
  );
}
