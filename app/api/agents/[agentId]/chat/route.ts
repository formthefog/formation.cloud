import { NextRequest } from "next/server";
import { NextResponse } from "next/server";



export async function POST(
    request: NextRequest,
    { params }: { params: { agentId: string } }
  ) {
    const agentId = await params.agentId;
    
    try {
      const body = await request.json();
      const { message } = body;
  
      // For chat, we'll simulate a response since we don't have a real chat endpoint
      // In a real implementation, this would call your chat service
      const response = {
        response: `This is a simulated response for agent ${agentId}. You said: ${message}`,
        timestamp: new Date().toISOString()
      };
  
      return NextResponse.json({ Success: response });
    } catch (error) {
      console.error('Error in chat:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get chat response' },
        { status: 500 }
      );
    }
  } 