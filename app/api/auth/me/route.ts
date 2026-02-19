import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = (await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    })) as { id: string; name: string; email: string; createdAt: string } | null;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}


