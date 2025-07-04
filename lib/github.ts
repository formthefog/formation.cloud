import { App } from "@octokit/app";
import { createAppAuth } from "@octokit/auth-app";
import { createNodeMiddleware } from "@octokit/webhooks";
import { Octokit } from "octokit";

export const githubApp = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET!,
  },
});

export const webhookMiddleware = createNodeMiddleware(githubApp.webhooks, {
  path: "/api/github/webhooks",
});

export function getGitHubAuthUrl(state?: string) {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL!,
    scope: "repo,write:repo_hook",
    state: state || Math.random().toString(36).substring(7),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function getInstallationOctokit(installationId: number) {
  // 1. Create an installation access token
  const accessToken = await githubApp.getInstallationOctokit(installationId);

  // 2. Return an Octokit instance authenticated as the installation
  return new Octokit({ auth: accessToken });
}

export const octokitAppAuth = createAppAuth({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
});
