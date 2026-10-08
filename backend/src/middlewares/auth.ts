import { Context, Next } from "hono";
import { verify } from "hono/jwt";

interface Bindings {
  JWT_SECRET: string;
}

interface Variables {
  userId: string;
}

type AuthContext = Context<{
  Bindings: Bindings;
  Variables: Variables;
}>;

export const authMiddleware = async (c: AuthContext, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ 
      error: "Missing or invalid authorization header", 
      redirect: "/signup" 
    });
  }

  const token = authHeader.split(" ")[1];

  let payload: Record<string, unknown>;
  try {
    payload = await verify(token, c.env.JWT_SECRET, "HS256");
  } catch {
    c.status(401);
    return c.json({ error: "Invalid or expired token", redirect: "/signup" });
  }

  // Tokens issued before expiry was added never lapse, so they are no longer accepted.
  if (typeof payload.id !== "string" || typeof payload.exp !== "number") {
    c.status(401);
    return c.json({ error: "Invalid or expired token", redirect: "/signup" });
  }

  c.set("userId", payload.id);
  await next();
};
