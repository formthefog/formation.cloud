import jwt from 'jsonwebtoken';
import { createPrivateKey } from 'crypto';

interface JWTPayload {
  sub: string;
  wallet?: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export class JWTService {
  private static instance: JWTService;
  private privateKey: string;

  private constructor() {
    // Load private key from environment and replace \n with actual newlines
    this.privateKey = (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  }

  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  public generateToken(userId: string, walletAddress?: string): string {
    const payload: JWTPayload = {
      sub: userId,
      wallet: walletAddress,
      iss: process.env.NEXT_PUBLIC_JWT_ISSUER!,
      aud: process.env.NEXT_PUBLIC_JWT_AUDIENCE!,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    };

    const key = createPrivateKey(this.privateKey);
    
    return jwt.sign(payload, key, {
      algorithm: 'RS256',
      keyid: process.env.JWT_KEY_ID // Should match the kid in your JWKS
    });
  }

  public verifyToken(token: string): JWTPayload | null {
    try {
      const key = createPrivateKey(this.privateKey);
      return jwt.verify(token, key, {
        algorithms: ['RS256'],
        issuer: process.env.NEXT_PUBLIC_JWT_ISSUER,
        audience: process.env.NEXT_PUBLIC_JWT_AUDIENCE
      }) as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  public decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }
} 