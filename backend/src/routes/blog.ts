import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware, optionalAuth } from "../middlewares/auth";
import { byUser, rateLimit } from "../lib/rateLimit";
import { createPostSchema, updatePostSchema } from "../lib/validation";
import { excerpt, plainText, readMinutes } from "../lib/text";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    AI: any;
  };
  Variables: {
    userId: string;
  };
}>();

const PAGE_SIZE = 20;
const uuid = z.string().uuid();

const db = (url: string) => new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

const uniqueTags = (tags?: string[]) =>
  [...new Set(tags ?? [])].map((name) => ({ where: { name }, create: { name } }));

blogRouter.get("/bulk", optionalAuth, async (c) => {
  const cursor = c.req.query("cursor");
  if (cursor && !uuid.safeParse(cursor).success) {
    return c.json({ error: "Invalid cursor" }, 400);
  }
  const q = (c.req.query("q") ?? "").trim().slice(0, 100);
  const userId = c.get("userId");

  try {
    const rows = await db(c.env.DATABASE_URL).post.findMany({
      where: {
        published: true,
        ...(q && {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
            { tags: { some: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: PAGE_SIZE + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: { select: { name: true } },
        tags: { select: { name: true } },
        _count: { select: { likes: true } },
        likes: { where: { userId: userId ?? "" }, select: { id: true } },
      },
    });

    const page = rows.slice(0, PAGE_SIZE);
    return c.json({
      posts: page.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: excerpt(p.content),
        readMinutes: readMinutes(p.content),
        createdAt: p.createdAt,
        author: p.author,
        tags: p.tags,
        likeCount: p._count.likes,
        likedByMe: p.likes.length > 0,
      })),
      nextCursor: rows.length > PAGE_SIZE ? page[page.length - 1].id : null,
    });
  } catch (e) {
    console.error("Error fetching posts", e);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

blogRouter.get("/:id", optionalAuth, async (c) => {
  const id = c.req.param("id");
  if (!uuid.safeParse(id).success) return c.json({ error: "Post not found" }, 404);
  const userId = c.get("userId");

  try {
    const post = await db(c.env.DATABASE_URL).post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: { select: { name: true } },
        tags: { select: { name: true } },
        _count: { select: { likes: true } },
        likes: { where: { userId: userId ?? "" }, select: { id: true } },
      },
    });
    if (!post) return c.json({ error: "Post not found" }, 404);

    return c.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        author: post.author,
        tags: post.tags,
        readMinutes: readMinutes(post.content),
        likeCount: post._count.likes,
        likedByMe: post.likes.length > 0,
        isMine: Boolean(userId) && post.authorId === userId,
      },
    });
  } catch (e) {
    console.error("Error fetching post", e);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

blogRouter.post("/", authMiddleware, rateLimit("post", 10, byUser), async (c) => {
  const parsed = createPostSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Inputs are incorrect" }, 400);

  try {
    const post = await db(c.env.DATABASE_URL).post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        published: true,
        authorId: c.get("userId"),
        tags: { connectOrCreate: uniqueTags(parsed.data.tags) },
      },
    });
    return c.json({ id: post.id }, 201);
  } catch (e) {
    console.error("Error creating post", e);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

blogRouter.put("/", authMiddleware, rateLimit("post", 10, byUser), async (c) => {
  const parsed = updatePostSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Inputs are incorrect" }, 400);
  const prisma = db(c.env.DATABASE_URL);

  try {
    const existing = await prisma.post.findUnique({
      where: { id: parsed.data.id },
      select: { authorId: true },
    });
    if (!existing) return c.json({ error: "Post not found" }, 404);
    if (existing.authorId !== c.get("userId")) {
      return c.json({ error: "You are not allowed to edit this post" }, 403);
    }

    const post = await prisma.post.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        ...(parsed.data.tags && {
          tags: { set: [], connectOrCreate: uniqueTags(parsed.data.tags) },
        }),
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.error("Error updating post", e);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

blogRouter.delete("/:id", authMiddleware, rateLimit("post", 10, byUser), async (c) => {
  const id = c.req.param("id");
  if (!uuid.safeParse(id).success) return c.json({ error: "Post not found" }, 404);
  const prisma = db(c.env.DATABASE_URL);

  try {
    const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!existing) return c.json({ error: "Post not found" }, 404);
    if (existing.authorId !== c.get("userId")) {
      return c.json({ error: "You are not allowed to delete this post" }, 403);
    }
    await prisma.post.delete({ where: { id } });
    return c.json({ message: "Post deleted" });
  } catch (e) {
    console.error("Error deleting post", e);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

blogRouter.post("/like/:id", authMiddleware, rateLimit("like", 60, byUser), async (c) => {
  const postId = c.req.param("id");
  if (!uuid.safeParse(postId).success) return c.json({ error: "Post not found" }, 404);
  const userId = c.get("userId");
  const prisma = db(c.env.DATABASE_URL);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) return c.json({ error: "Post not found" }, 404);

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: { userId, postId } });
    }
    const likeCount = await prisma.like.count({ where: { postId } });
    return c.json({ liked: !existingLike, likeCount });
  } catch (e) {
    console.error("Error toggling like", e);
    return c.json({ error: "Action failed" }, 500);
  }
});

const SUMMARY_INPUT_CHARS = 6000;
const SUMMARY_CACHE_SECONDS = 7 * 24 * 60 * 60;

const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

blogRouter.post("/summarize/:id", authMiddleware, rateLimit("summarize", 5, byUser), async (c) => {
  const id = c.req.param("id");
  if (!uuid.safeParse(id).success) return c.json({ error: "Post not found" }, 404);

  const post = await db(c.env.DATABASE_URL).post.findUnique({ where: { id }, select: { content: true } });
  if (!post) return c.json({ error: "Post not found" }, 404);

  if (!c.env.AI) {
    console.error("AI Binding missing in wrangler.toml");
    return c.json({ error: "AI configuration error" }, 500);
  }

  const text = plainText(post.content).slice(0, SUMMARY_INPUT_CHARS);
  // Keyed by content hash so an edited post gets a fresh summary.
  const cacheKey = new Request(`https://summary-cache.inscribe/${id}/${await sha256Hex(text)}`);
  const cache = (caches as unknown as { default: Cache }).default;
  const cached = await cache.match(cacheKey);
  if (cached) return c.json({ summary: await cached.text() });

  try {
    const response = await c.env.AI.run("@cf/mistralai/mistral-small-3.1-24b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are Inscribe's blog summarizer. Write exactly 2 sentences capturing the post's core point or main takeaway, aimed at a reader deciding whether to read further. Plain text only: no markdown, no quotation marks, no preamble like 'Here is a summary'. If the post is short or mostly code/lists, summarize its purpose rather than restating it verbatim.",
        },
        { role: "user", content: text },
      ],
    });
    const summary: string = response.response;
    c.executionCtx.waitUntil(
      cache.put(cacheKey, new Response(summary, { headers: { "Cache-Control": `max-age=${SUMMARY_CACHE_SECONDS}` } }))
    );
    return c.json({ summary });
  } catch (e) {
    console.error("Summarize failed:", e);
    return c.json({ error: "Could not generate summary right now" }, 500);
  }
});
