import { createClient } from "@supabase/supabase-js";
import { Octokit } from "octokit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async createIntegration(accountId: string, repoUrl: string, branch: string) {
    try {
      // Parse repository details from URL
      const [owner, repo] = this.parseRepoUrl(repoUrl);

      // Verify repository access
      await this.octokit.rest.repos.get({ owner, repo });

      // Create webhook
      const webhook = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: `https://${process.env.VERCEL_BRANCH_URL}/api/github/webhooks`,
          content_type: "json",
          secret: process.env.GITHUB_WEBHOOK_SECRET,
        },
        events: ["push", "deployment"],
      });

      // Store integration in database
      const { data: integration, error } = await supabase
        .from("github_integrations")
        .insert({
          account_id: accountId,
          repository_name: `${owner}/${repo}`,
          repository_url: repoUrl,
          branch,
          webhook_id: webhook.data.id.toString(),
          webhook_secret: process.env.GITHUB_WEBHOOK_SECRET,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;
      return integration;
    } catch (error) {
      console.error("Failed to create GitHub integration:", error);
      throw error;
    }
  }

  async getIntegrations(accountId: string) {
    const { data, error } = await supabase
      .from("github_integrations")
      .select(
        `
        *,
        github_deployments (*)
      `
      )
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  private parseRepoUrl(url: string): [string, string] {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub repository URL");
    return [match[1], match[2]];
  }
}
