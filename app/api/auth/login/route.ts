import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { comparePassword, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    const user = (await prisma.user.findUnique({ where: { email } })) as
      | { id: string; email: string; name: string; passwordHash: string }
      | null;
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken({ userId: user.id, email: user.email });
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}


