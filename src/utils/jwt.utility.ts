// utils/jwt.util.ts
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export class JwtUtil {
  private static readonly secret = process.env.JWT_SECRET || "default_secret"; // store securely in env
  private static readonly defaultExpiry = 1;

  /**
   * Generate a JWT token
   * @param payload - Data you want to embed in the token
   * @param expiresIn - Expiration time (default 1h)
   */
  static sign(payload: object, expiresIn: number = this.defaultExpiry): string {
    // const options: SignOptions = { expiresIn };
    return jwt.sign(payload, this.secret);
  }

  /**
   * Verify a JWT token
   * @param token - JWT string
   * @returns Decoded payload if valid
   * @throws Error if invalid or expired
   */
  static verify<T extends object | string = JwtPayload>(token: string): T {
    try {
      return jwt.verify(token, this.secret) as T;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
