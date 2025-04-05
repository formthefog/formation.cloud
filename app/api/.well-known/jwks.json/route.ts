import { NextResponse } from 'next/server';
import { generateJWKS } from '@/lib/utils/jwks';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jwks = generateJWKS();

    return NextResponse.json(jwks, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('JWKS endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWKS' },
      { status: 500 }
    );
  }
} 