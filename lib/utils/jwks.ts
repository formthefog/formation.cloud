import { createPublicKey } from 'crypto';

interface JWK {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

export function generateJWKS(): { keys: JWK[] } {
  try {
    // Get the private key from environment and replace \n with actual newlines
    const privateKeyPEM = (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    
    if (!privateKeyPEM) {
      throw new Error('JWT_PRIVATE_KEY is not set in environment variables');
    }

    // Create public key from private key
    const publicKey = createPublicKey({
      key: privateKeyPEM,
      format: 'pem'
    });

    // Get the public key in JWK format
    const jwk = publicKey.export({ format: 'jwk' });

    if (!process.env.JWT_KEY_ID) {
      throw new Error('JWT_KEY_ID is not set in environment variables');
    }

    return {
      keys: [{
        kty: 'RSA',
        kid: process.env.JWT_KEY_ID,
        use: 'sig',
        alg: 'RS256',
        n: jwk.n!,
        e: jwk.e!
      }]
    };
  } catch (error) {
    console.error('Error generating JWKS:', error);
    throw new Error('Failed to generate JWKS');
  }
} 