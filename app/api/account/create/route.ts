import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const BACKEND_URL = process.env.BACKEND_URL || 'http://170.250.22.3:3004';

export async function POST(request: NextRequest) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.address) {
      return NextResponse.json(
        { error: 'Email and address are required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/account/create`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
        'User-Agent': 'Formation-Web/1.0'
      },
      body: JSON.stringify(body)
    });

    // Get the response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error in account creation:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 