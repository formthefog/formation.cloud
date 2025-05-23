import { JwksClient } from "jwks-rsa";
import jwt from "jsonwebtoken";

const jwksClient = new JwksClient({
  jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`,
});

export async function verifyDynamicJWT(token: string) {
  try {
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header.kid) {
      throw new Error("Invalid token");
    }

    const key = await jwksClient.getSigningKey(decodedToken.header.kid);
    const publicKey = key.getPublicKey();

    const verified = jwt.verify(token, publicKey);
    return verified;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
