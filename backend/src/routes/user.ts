import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@shaikhaman/medium-common";
import { burnPasswordCheck, hashPassword, verifyPassword } from "../lib/password";
import { rateLimit } from "../lib/rateLimit";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
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
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.username,
      },
    });

    if (existingUser) {
      c.status(400);
      return c.json({ error: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: await hashPassword(body.password),
        name: body.name,
      },
    });

    return c.json({
      jwt: await issueToken(user.id, c.env.JWT_SECRET),
      name: user.name,
    });
  } catch (e) {
    console.error("Error in signup:", errorCode(e));
    c.status(403);
    return c.json({ error: "Failed to create user" });
  }
});

userRouter.post("/signin", rateLimit("signin", 10), async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json().catch(() => null);

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }

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
      c.status(401);
      return c.json({ error: "Invalid email or password" });
    }

    const { ok, needsRehash } = await verifyPassword(body.password, user.password);
    if (!ok) {
      c.status(401);
      return c.json({ error: "Invalid email or password" });
    }

    if (needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(body.password) },
      });
    }

    return c.json({ jwt: await issueToken(user.id, c.env.JWT_SECRET), name: user.name });
  } catch (e) {
    console.error("Error in signin:", errorCode(e));
    c.status(403);
    return c.json({ error: "Authentication failed" });
  }
});
