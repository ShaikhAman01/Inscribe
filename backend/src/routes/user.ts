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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}


userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log("Signup request body:", body);

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where:{
        email:body.username
      }
    })

    if(existingUser){
      c.status(400);
        return c.json({error: "User already exists"})
    }

    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: hashedPassword,
        name: body.name,
      },
    });
    console.log("Created user:", user);

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    console.log("Response being sent:", { jwt: token, name: user.name });

    return c.json({
      jwt: token,
      name: user.name,
    });
  } catch (e) {
    console.error("Error in signup",e)
    c.status(403);
    return c.json({ error: "Failed to create user" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log("Signin request body:", body);

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
        id:true,
        name: true,
        password:true
      },
    });

    console.log("Found user:", user);

    if (!user) {
      c.status(401);
      return c.json({ error: "User not found" });
    }

    //  password verification
    const isPasswordValid = await verifyPassword(body.password, user.password);
    if (!isPasswordValid) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }


    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    console.log("Response being sent:", { jwt, name: user.name });
    return c.json({ jwt, name: user.name });
  } catch (e) {
    console.error("Error in signin:", e);
    c.status(403);
    return c.json({ error: "Authentication failed" });
  }
});
