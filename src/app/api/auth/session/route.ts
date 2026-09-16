import { NextRequest, NextResponse } from "next/server";

const SECURE = process.env.NODE_ENV === "production";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  let body: { jwt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const jwt = body.jwt;
  if (!jwt || typeof jwt !== "string" || jwt.length < 10) {
    return NextResponse.json({ error: "missing jwt" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("credentials", jwt, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  res.cookies.set("logged_in", "1", {
    httpOnly: false,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("credentials", "", {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("logged_in", "", {
    httpOnly: false,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}