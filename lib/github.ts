import { App } from "@octokit/app";
import { createNodeMiddleware } from "@octokit/webhooks";

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
