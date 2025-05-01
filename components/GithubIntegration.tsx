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
  account_name?: string;
  account_id?: string;
  installation_id?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  [key: string]: any;
}

export function GitHubIntegration() {
  const { user, primaryWallet } = useDynamicContext();
  const [integrations, setIntegrations] = useState<GitHubIntegration[]>([]);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

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

      // If we have an integration, fetch repos
      if (data && data.length > 0) {
        fetchRepositories();
      }
    } catch (error) {
      console.error("Failed to load integrations:", error);
      toast.error("Failed to load GitHub integrations");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRepositories() {
    try {
      setReposLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `/api/github/repos?account_id=93ce6b4e-49c3-4137-aaa0-052d3e49a1a5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to load repositories");

      const { repositories } = await response.json();
      setRepositories(repositories || []);
    } catch (error) {
      console.error("Failed to load repositories:", error);
      toast.error("Failed to load GitHub repositories");
    } finally {
      setReposLoading(false);
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

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    toast.success(`Selected repository: ${repo.full_name}`);
    // You can add more logic here (e.g., navigate, open modal, etc.)
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
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">GitHub Integrations</h2>
        {integrations.length > 0 ? (
          <Button
            disabled
            className="bg-green-600 hover:bg-green-600/90 text-white cursor-default"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Connected
          </Button>
        ) : (
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
        )}
      </div>

      {/* Integrations Section */}
      {loading ? (
        <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
          <div className="px-6 py-4 border-b">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          </div>
          <div className="p-6">
            <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        </div>
      ) : integrations.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium">
              Active GitHub App Installations
            </h3>
          </div>
          <div className="divide-y">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {integration.account_name ||
                        integration.account_id ||
                        "Unknown Account"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Installation ID: {integration.installation_id}
                    </p>
                    <p className="text-xs text-gray-400">
                      Status: {integration.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://github.com/apps/formation-deploy`,
                          "_blank"
                        )
                      }
                    >
                      Manage on GitHub
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">
            No GitHub App Installations
          </h3>
          <p className="text-gray-500">
            Connect your GitHub account or organization to get started.
          </p>
        </div>
      )}

      {/* Repositories Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">
          Available GitHub Repositories
        </h3>
        {reposLoading ? (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm p-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between mb-2 animate-pulse"
              >
                <div className="h-5 w-64 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : repositories.length > 0 ? (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul className="divide-y divide-gray-200 px-2 py-2">
              {repositories
                .sort((a, b) => b.id - a.id)
                .map((repo) => (
                  <li
                    key={repo.id}
                    className={`py-3 px-4 flex items-center justify-between bg-gray-50 rounded-md shadow-sm mb-2 hover:bg-blue-50 transition-colors ${
                      selectedRepo?.id === repo.id ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-700 hover:underline"
                      >
                        {repo.full_name}
                      </a>
                      {repo.private && (
                        <span className="ml-3 px-2 py-0.5 text-xs bg-gray-300 text-gray-700 rounded">
                          Private
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={
                        selectedRepo?.id === repo.id ? "default" : "outline"
                      }
                      onClick={() => handleSelectRepo(repo)}
                      disabled={selectedRepo?.id === repo.id}
                    >
                      {selectedRepo?.id === repo.id ? "Selected" : "Select"}
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div>No repositories found.</div>
        )}
      </div>
    </div>
  );
}
