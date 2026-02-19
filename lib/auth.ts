import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";
const DEFAULT_JWT_SECRET = "dev_only_jwt_secret_change_me";
let warnedAboutFallbackSecret = false;

type JwtPayload = {
  userId: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function resolveJwtSecret() {
  const configured = process.env.JWT_SECRET?.trim();
  if (configured && configured !== "replace_with_strong_secret") {
    return configured;
  }
  if (!warnedAboutFallbackSecret) {
    console.warn("JWT_SECRET is not set. Falling back to an insecure development secret.");
    warnedAboutFallbackSecret = true;
  }
  return DEFAULT_JWT_SECRET;
}

export function signToken(payload: JwtPayload) {
  const secret = resolveJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  const secret = resolveJwtSecret();
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}


