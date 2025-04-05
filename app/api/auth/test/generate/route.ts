import { NextResponse } from 'next/server';
import { JWTService } from '@/lib/services/jwt';

export async function GET() {
  try {
    const jwtService = JWTService.getInstance();
    
    // Generate a test token with some dummy data
    const token = jwtService.generateToken(
      'test-user-123',
      '0x1234567890abcdef' // example wallet address
    );

    // Set the token in a cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Test token generated',
      token 
    });

    // Set the cookie with the token
    response.cookies.set('formation_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 