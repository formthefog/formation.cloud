import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { JwtService } from './jwt';

export class DynamicAuthService {
  private static instance: DynamicAuthService;
  private jwtService: JwtService;

  private constructor() {
    this.jwtService = new JwtService();
  }

  public static getInstance(): DynamicAuthService {
    if (!DynamicAuthService.instance) {
      DynamicAuthService.instance = new DynamicAuthService();
    }
    return DynamicAuthService.instance;
  }

  public async handleAuthSuccess(user: any) {
    try {
      // Generate JWT token using our custom service
      const token = await this.jwtService.generateToken({
        userId: user.id,
        email: user.email,
        walletAddress: user.walletAddress
      });

      // Store the token
      localStorage.setItem('auth_token', token);
      
      return token;
    } catch (error) {
      console.error('Auth success handling failed:', error);
      throw error;
    }
  }

  public async handleAuthError(error: any) {
    console.error('Authentication error:', error);
    localStorage.removeItem('auth_token');
    throw error;
  }

  public async logout() {
    try {
      localStorage.removeItem('auth_token');
      // Add any additional logout logic here
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
} 