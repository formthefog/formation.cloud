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

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 401 });
  }

  return new Promise((resolve) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Token is invalid' }, { status: 401 }));
      } else {
        resolve(NextResponse.json({ message: 'Token is valid', decoded }, { status: 200 }));
      }
    });
  });
} 