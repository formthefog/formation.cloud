import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: {
    agentId: string;
  };
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();
    const { message } = body;

    // Mock response for now
    return NextResponse.json({
      Success: {
        response: `Response from agent ${agentId}: ${message}`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 