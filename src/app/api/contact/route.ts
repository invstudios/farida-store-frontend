import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_ENDPOINT =
  process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT || "";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const ipHits = new Map<string, { start: number; count: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = ipHits.get(ip);
  if (!bucket || bucket.start < now - WINDOW_MS) {
    ipHits.set(ip, { start: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  if (!STRAPI_API_ENDPOINT) {
    return NextResponse.json(
      { error: "Contact service unavailable" },
      { status: 500 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts, please try again later" },
      { status: 429 }
    );
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }
  if (name.length > MAX_NAME) {
    return NextResponse.json(
      { error: `Name must be ${MAX_NAME} characters or fewer` },
      { status: 400 }
    );
  }
  if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE} characters or fewer` },
      { status: 400 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${STRAPI_API_ENDPOINT}/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data: { name, email, message } }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the backend" },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}