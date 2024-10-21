import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createCommentInput } from "@shaikhaman/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

commentRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const token = jwt.split(" ")[1];

  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload || typeof payload.id !== "string") {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
  c.set("userId", payload.id);
  await next();
});

commentRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createCommentInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incoorect",
    });
  }

  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        authorId: body.userId,
      },
    });
    comment.status(201);
    return comment.json({ id: comment.id });
  } catch (e) {
    console.error("Error creating commet", e);
    c.status(500);
    return c.json({ erro: "Failed to create comment" });
  }
});

commentRouter.get("/posts/:postId", async (c) => {
  const { postId } = c.req.param();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    c.status(200);
    return c.json({ comments });
  } catch (e) {
    console.error("Error Fetching comments", e);
    c.status(500);
    return c.json({ error: "Failed to fetch comments" });
  }
});
