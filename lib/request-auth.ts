import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";

export function getAuthFromRequest(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const token = header.replace("Bearer ", "").trim();
  if (!token) {
    return null;
  }
  return verifyToken(token);
}


