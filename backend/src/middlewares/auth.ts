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
    return c.json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || typeof payload !== "object" || !("id" in payload)) {
      c.status(401);
      return c.json({ error: "Invalid token payload" });
    }

    c.set("userId", payload.id as string);
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }
};
