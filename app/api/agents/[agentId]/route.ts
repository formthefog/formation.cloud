import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const agentId = await params.agentId;
  
  try {
    // Fetch from the list endpoint instead
    const response = await fetch('http://170.250.22.3:3004/agent/list', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
      console.log('API Response:', data); // Debug log
    } catch (e) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('Invalid JSON response from server');
    }

    // Handle the nested List structure
    const agents = data?.Success?.List || [];

    if (!Array.isArray(agents)) {
      console.error('Unexpected response structure:', data);
      throw new Error('Invalid response structure from server');
    }

    // Find the specific agent by ID
    const agent = agents.find((a: any) => 
      String(a.id) === String(agentId) || 
      a.name?.toLowerCase().replace(/\s+/g, '-') === agentId.toLowerCase()
    );
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ Success: agent });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch agent details' },
      { status: 500 }
    );
  }
}

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