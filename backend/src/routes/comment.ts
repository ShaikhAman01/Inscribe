import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createCommentInput } from "@shaikhaman/medium-common";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware, optionalAuth } from "../middlewares/auth";
import { byUser, rateLimit } from "../lib/rateLimit";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

const uuid = z.string().uuid();

const db = (url: string) => new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

commentRouter.post("/", authMiddleware, rateLimit("comment", 10, byUser), async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json().catch(() => null);
  const { success } = createCommentInput.safeParse(body);
  if (!success) return c.json({ error: "Inputs are incorrect" }, 400);
  const prisma = db(c.env.DATABASE_URL);

  try {
    const post = await prisma.post.findUnique({ where: { id: body.postId }, select: { id: true } });
    if (!post) return c.json({ error: "Post not found" }, 404);

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        authorId: userId,
      },
      include: {
        author: { select: { name: true } },
      },
    });
    return c.json(
      {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: comment.author,
        isMine: true,
        canDelete: true,
      },
      201
    );
  } catch (e) {
    console.error("Error creating comment", e);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

commentRouter.get("/posts/:postId", optionalAuth, async (c) => {
  const postId = c.req.param("postId");
  if (!uuid.safeParse(postId).success) return c.json({ error: "Post not found" }, 404);
  const userId = c.get("userId");
  const prisma = db(c.env.DATABASE_URL);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!post) return c.json({ error: "Post not found" }, 404);

    const comments = await prisma.comment.findMany({
      where: { postId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return c.json({
      comments: comments.map(({ authorId, ...comment }) => ({
        ...comment,
        isMine: Boolean(userId) && authorId === userId,
        canDelete: Boolean(userId) && (authorId === userId || post.authorId === userId),
      })),
    });
  } catch (e) {
    console.error("Error fetching comments", e);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
});

// The comment's author or the post's author may remove a comment.
commentRouter.delete("/:id", authMiddleware, rateLimit("comment", 10, byUser), async (c) => {
  const id = c.req.param("id");
  if (!uuid.safeParse(id).success) return c.json({ error: "Comment not found" }, 404);
  const userId = c.get("userId");
  const prisma = db(c.env.DATABASE_URL);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true, post: { select: { authorId: true } } },
    });
    if (!comment) return c.json({ error: "Comment not found" }, 404);
    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      return c.json({ error: "You are not allowed to delete this comment" }, 403);
    }
    await prisma.comment.delete({ where: { id } });
    return c.json({ message: "Comment deleted" });
  } catch (e) {
    console.error("Error deleting comment", e);
    return c.json({ error: "Failed to delete comment" }, 500);
  }
});
