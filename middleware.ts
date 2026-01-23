// This is for staging password in VERCEL

export const config = {
  matcher: "/:path",
};

export default function middleware(request: Request) {
  if (process.env.VERCEL_ENV !== "preview") {
    return;
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Staging"',
      },
    });
  }

  const encoded = authHeader.split(" ")[1];
  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");

  if (user !== process.env.STAGING_USER || pass !== process.env.STAGING_PASS) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Staging"',
      },
    });
  }
}
