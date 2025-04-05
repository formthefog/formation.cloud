import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '@/lib/services/jwt';

export async function GET(request: NextRequest) {
  try {
    const jwtService = JWTService.getInstance();
    
    // Get the token from the cookie
    const token = request.cookies.get('formation_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = jwtService.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      payload
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
} 