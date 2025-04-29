import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const AGENT_MAP: Record<string, string> = {
  "blog-post-generator": "blog-post-generator.py",
  "books-recommender": "books-recommender.py",
  "discussion-team": "discussion-team.py",
  "finance-agent": "finance-agent.py",
  "investment-report-generator": "investment-report-generator.py",
  "movie-recommender": "movie-recommender.py",
  "new-agency-team": "new-agency-team.py",
  "recipe-creator": "recipe-creator.py",
  "research-agent": "research-agent.py",
  "start-up-idea-validator": "start-up-idea-validator.py",
  "teaching-assistant": "teaching-assistant.py",
  "travel-agent": "travel-agent.py",
  "youtube-agent": "youtube-agent.py",
  // Add more mappings as needed
};

export async function GET(
  _req: Request,
  { params }: { params: { agentId: string } }
) {
  const filename = AGENT_MAP[params.agentId];
  if (!filename) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  const filePath = path.join(
    process.cwd(),
    "public/agent-scripts/agno",
    filename
  );
  try {
    const code = await fs.readFile(filePath, "utf8");
    return NextResponse.json({ code });
  } catch (e) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
