import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { JWTService } from '@/lib/services/jwt';

export class DynamicAuthService {
  private static instance: DynamicAuthService;
  private jwtService: JWTService;

  private constructor() {
    this.jwtService = JWTService.getInstance();
  }

  public static getInstance(): DynamicAuthService {
    if (!DynamicAuthService.instance) {
      DynamicAuthService.instance = new DynamicAuthService();
    }
    return DynamicAuthService.instance;
  }

  public async handleAuthSuccess(user: any): Promise<void> {
    try {
      // Generate a token for the authenticated user
      const token = this.jwtService.generateToken(
        user.userId || user.id,
        user.walletAddress
      );

      // Store the token in a cookie (this will be picked up by Dynamic)
      document.cookie = `${process.env.JWT_COOKIE_NAME || 'formation_auth_token'}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    } catch (error) {
      console.error('Failed to handle auth success:', error);
      throw error;
    }
  }

  public async handleAuthError(error: any): Promise<void> {
    console.error('Authentication error:', error);
    this.clearAuthCookie();
  }

  public async logout(): Promise<void> {
    this.clearAuthCookie();
  }

  private clearAuthCookie(): void {
    document.cookie = `${process.env.JWT_COOKIE_NAME || 'formation_auth_token'}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
} 