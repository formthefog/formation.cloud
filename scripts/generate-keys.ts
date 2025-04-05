import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Generate RSA key pair
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Generate a random key ID
const keyId = Math.random().toString(36).substring(2, 15);

// Format private key for .env file (replace newlines with literal \n)
const formattedPrivateKey = privateKey.replace(/\n/g, '\\n');

// Create the .env content
const envContent = `# Dynamic Environment ID
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id

# JWT Configuration
NEXT_PUBLIC_JWT_ISSUER=formation.cloud
NEXT_PUBLIC_JWKS_URL=http://localhost:3000/api/.well-known/jwks.json
NEXT_PUBLIC_JWT_AUDIENCE=formation.cloud

# JWT Private Key (Keep this secure)
JWT_PRIVATE_KEY="${formattedPrivateKey}"
JWT_KEY_ID="${keyId}"

# Cookie Name for JWT
JWT_COOKIE_NAME=formation_auth_token`;

// Write the .env file
writeFileSync(join(process.cwd(), '.env.local'), envContent);

// Also save the public key for reference
writeFileSync(join(process.cwd(), 'public.key'), publicKey);

console.log('✅ Generated RSA key pair and updated .env.local');
console.log('🔑 Key ID:', keyId);
console.log('\nPublic Key (for verification):\n', publicKey); 