import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@shaikhaman/medium-common";
import { burnPasswordCheck, hashPassword, verifyPassword } from "../lib/password";
import { byUser, rateLimit } from "../lib/rateLimit";
import { deleteAccountSchema } from "../lib/validation";
import { authMiddleware } from "../middlewares/auth";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Prisma messages can echo query arguments (including password hashes), so only the code is logged.
const errorCode = (e: unknown) => (e as { code?: string }).code ?? (e as Error).name;

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const issueToken = (userId: string, secret: string) =>
  sign({ id: userId, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }, secret);

userRouter.post("/signup", rateLimit("signup", 5), async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json().catch(() => null);

  const { success } = signupInput.safeParse(body);
  if (!success) return c.json({ error: "Inputs are incorrect" }, 400);

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.username,
      },
    });

    if (existingUser) return c.json({ error: "An account with this email already exists" }, 409);

    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: await hashPassword(body.password),
        name: body.name,
      },
    });

    return c.json({ jwt: await issueToken(user.id, c.env.JWT_SECRET), name: user.name }, 201);
  } catch (e) {
    console.error("Error in signup:", errorCode(e));
    return c.json({ error: "Failed to create user" }, 500);
  }
});

userRouter.post("/signin", rateLimit("signin", 10), async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json().catch(() => null);

  const { success } = signinInput.safeParse(body);
  if (!success) return c.json({ error: "Inputs are incorrect" }, 400);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.username,
      },
      select: {
        id: true,
        name: true,
        password: true,
      },
    });

    if (!user) {
      await burnPasswordCheck(body.password);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const { ok, needsRehash } = await verifyPassword(body.password, user.password);
    if (!ok) return c.json({ error: "Invalid email or password" }, 401);

    if (needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(body.password) },
      });
    }

    return c.json({ jwt: await issueToken(user.id, c.env.JWT_SECRET), name: user.name });
  } catch (e) {
    console.error("Error in signin:", errorCode(e));
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// Removes the account and, through cascading foreign keys, its posts, comments and likes.
userRouter.delete("/me", authMiddleware, rateLimit("delete-account", 5, byUser), async (c) => {
  const parsed = deleteAccountSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Password is required" }, 400);
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: { id: c.get("userId") },
      select: { id: true, password: true },
    });
    if (!user) return c.json({ error: "Account not found" }, 404);

    const { ok } = await verifyPassword(parsed.data.password, user.password);
    if (!ok) return c.json({ error: "Incorrect password" }, 401);

    await prisma.user.delete({ where: { id: user.id } });
    return c.json({ message: "Account deleted" });
  } catch (e) {
    console.error("Error deleting account:", errorCode(e));
    return c.json({ error: "Failed to delete account" }, 500);
  }
});
