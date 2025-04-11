import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://170.250.22.3:3004/agent/list', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
} 