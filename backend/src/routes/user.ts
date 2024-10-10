import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@shaikhaman/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// todo: hash password
// todo: add zod validation
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
        message: "Inputs are incorrect"
    })
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
        ...(body.name && { name: body.name }),
      },
    });

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    return c.json({ jwt: token });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Failed to create user" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
        message: "Inputs are incorrect"
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.username,
        password: body.password,
      },
    });

    if (!user) {
      c.status(400);
      return c.json({ error: "User not found" });
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    return c.json({ jwt });
  } catch (e) {
    return c.status(403);
  }
});
