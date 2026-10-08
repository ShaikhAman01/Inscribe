import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import { byUser, rateLimit } from "../lib/rateLimit";
import { createPostSchema, updatePostSchema } from "../lib/validation";

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

blogRouter.use("*", authMiddleware);

blogRouter.post("/", rateLimit("post", 10, byUser), async (c) => {
  const parsed = createPostSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        authorId: authorId,
        tags: {
          connectOrCreate: [...new Set(parsed.data.tags ?? [])].map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
    c.status(200);
    return c.json({ id: post.id });
  } catch (e) {
    console.error("Error creating post", e);
    c.status(500);
    return c.json({ error: "Failed to create post" });
  }
});

blogRouter.put("/", rateLimit("post", 10, byUser), async (c) => {
  const body = await c.req.json().catch(() => null);
  const { success } = updatePostSchema.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: body.id },
      select: { authorId: true },
    });

    if (!existingPost || existingPost.authorId !== authorId) {
      c.status(403);
      return c.json({ error: "You are not allowed to edit this post" });
    }

    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    c.status(201);
    return c.json({ id: post.id });
  } catch (e) {
    console.error("Error updating post", e);
    c.status(500);
    return c.json({ error: "Failed to update post" });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const searchQuery = c.req.query("q"); // Extract the search query from the request

  try {
    const post = await prisma.post.findMany({
      where: searchQuery
        ? {
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                content: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
            ],
          }
        : {}, // If no search query, return all posts
      select: {
        content: true,
        title: true,
        id: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        tags: {
      select: {
        name: true
      }
    },
        _count: {
      select: { likes: true }
    },
    likes: {
      where: {
        userId: c.get("userId")
      }
    }
      },
    });

    c.status(201);
    return c.json({ post });
  } catch (e) {
    console.error("Error fetching posts", e);
    c.status(500);
    return c.json({ error: "Failed to fetch posts" });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        tags: {
      select: {
        name: true
      }
    },
        _count: {
      select: { likes: true }
    },
    likes: {
      where: {
        userId: c.get("userId")
      }    },
    
      },
    });
    c.status(200);
    return c.json({ post });
  } catch (e) {
    console.error("Error fetching post", e);
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});

blogRouter.post("/like/:id", rateLimit("like", 60, byUser), async (c) => {
  const postId = c.req.param("id");
  const userId = c.get("userId");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return c.json({ message: "Unliked" });
    }
    await prisma.like.create({ data: { userId, postId } });
    return c.json({ message: "Liked" });
  } catch (e) {
    return c.json({ error: "Action failed" }, 500);
  }
});

const SUMMARY_INPUT_CHARS = 6000;
const SUMMARY_CACHE_SECONDS = 7 * 24 * 60 * 60;

const plainText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

blogRouter.post("/summarize/:id", rateLimit("summarize", 5, byUser), async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({ where: { id }, select: { content: true } });
  if (!post) return c.json({ error: "Not found" }, 404);

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
