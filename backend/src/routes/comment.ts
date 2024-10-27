import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createCommentInput } from "@shaikhaman/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { authMiddleware } from "../middlewares/auth";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

commentRouter.use("/*", authMiddleware);

commentRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const { success } = createCommentInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incoorect",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    c.status(201);
    return c.json({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.author,
    });
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
