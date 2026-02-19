import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const items = await prisma.searchHistory.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const query = String(body?.query ?? "").trim();
    if (!query) {
      return NextResponse.json({ message: "query is required" }, { status: 400 });
    }
    const item = await prisma.searchHistory.create({
      data: {
        userId: auth.userId,
        query
      }
    });
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}


