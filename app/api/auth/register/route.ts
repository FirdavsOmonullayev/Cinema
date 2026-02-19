import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hashPassword, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
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
    const { email, name, password } = parsed.data;
    const exists = (await prisma.user.findUnique({ where: { email } })) as { id: string } | null;
    if (exists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const user = (await prisma.user.create({
      data: { email, name, passwordHash }
    })) as { id: string; email: string; name: string };
    const token = signToken({ userId: user.id, email: user.email });
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}


