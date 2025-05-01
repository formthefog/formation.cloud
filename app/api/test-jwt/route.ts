import { NextRequest, NextResponse } from 'next/server';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';



const jwksUri = 'https://app.dynamic.xyz/api/v0/sdk/3f53e601-17c7-419b-8a13-4c5e25c0bde9/.well-known/jwks';

const client = new JwksClient({
  jwksUri,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    // Verify the token using JWKS
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          console.error('Error verifying token:', err);
          reject(new Error('Token is invalid'));
        } else {
          resolve(decoded);
        }
      });
    });

    // Get the request body
    const body = await request.json();

    // Validate the input
    if (!body.name || !body.email || !body.address || body.hired_agents === undefined || body.instances === undefined || body.usage === undefined || body.subscription === undefined || body.credits === undefined) {
      return NextResponse.json(
        { error: 'Name, email, address, hired_agents, instances, usage, subscription, and credits are required' },
        { status: 400 }
      );
    }

    // Return success
    return NextResponse.json(
      { success: true, message: 'Successfully joined waitlist', decoded },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in waitlist API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}