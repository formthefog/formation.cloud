import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const AGENT_MAP: Record<string, string> = {
  "1af9cf0e-de4f-4bed-9659-ca314de68790": "finance-agent.py",
  "2ff31a7d-3fa2-41e0-865b-80dbf734b059": "teaching-assistant.py",
  "35128668-6491-4ac2-a6c3-9571be815b3b": "news-agency-team.py",
  "398b3a6d-5eab-49c1-953b-be093a52146a": "travel-agent.py",
  "4b042214-dd04-4d4d-981f-53237b4c7915": "investment-report-generator.py",
  "5fdd1cf1-ae5b-4f84-99a3-721fedb293e8": "recipe-creator.py",
  "79d43c33-9d60-4d2a-afab-e6c0114cdfb7": "discussion-team.py",
  "8b8d2f23-872e-4fc7-8311-d426ad10848a": "start-up-idea-validator.py",
  "917036af-d23b-4f85-8c4a-157a08537125": "github-repo-analyzer.py",
  "9d43c611-612d-4a8d-945e-2a9420f59d9f": "youtube-agent.py",
  "ccffd95f-d27f-48d7-9b9b-449c43926159": "books-recommender.py",
  "eb89a0a3-6c6a-4392-8965-1de5edf51561": "research-agent.py",
  "ee8b6b8a-6943-40ad-9a0f-dbd116411eb2": "movie-recommender.py",
  // Legacy/demo mapping
  "blog-post-generator": "blog-post-generator.py",
};

export async function GET(_req: Request, { params }: any) {
  const { agentId } = await params;
  const filename = AGENT_MAP[agentId];
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
