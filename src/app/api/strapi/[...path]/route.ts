import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_ENDPOINT =
  process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT || "";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

const PASSTHROUGH_AUTH_PATHS = ["auth/local", "auth/local/register"];

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const strapiPath = path.join("/");
  const query = req.nextUrl.search;

  if (!STRAPI_API_ENDPOINT) {
    return NextResponse.json(
      { error: "STRAPI_API_ENDPOINT is not configured" },
      { status: 500 }
    );
  }

  const userToken = req.cookies.get("credentials")?.value;
  const isAuthPath = PASSTHROUGH_AUTH_PATHS.some((p) => strapiPath.includes(p));
  const method = req.method.toUpperCase();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  if (userToken) {
    headers["Authorization"] = `Bearer ${userToken}`;
  } else if (STRAPI_API_TOKEN && !isAuthPath) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await req.text();

  let upstream;
  try {
    upstream = await fetch(`${STRAPI_API_ENDPOINT}/${strapiPath}${query}`, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the backend" },
      { status: 502 }
    );
  }

  const upstreamBody = await upstream.text();

  return new NextResponse(upstreamBody, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") || "application/json",
    },
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as DELETE,
};