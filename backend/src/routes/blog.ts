import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@shaikhaman/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { authMiddleware } from "../middlewares/auth";

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

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
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
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
        tags: {
          connectOrCreate: (body.tags || []).map((tag: string) => ({
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

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
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

blogRouter.post("/like/:id", async (c) => {
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

blogRouter.post("/summarize/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return c.json({ error: "Not found" }, 404);

  if (!c.env.AI) {
      console.error("AI Binding missing in wrangler.toml");
      return c.json({ error: "AI configuration error" }, 500);
    }

  try {
    const response = await c.env.AI.run("@cf/mistralai/mistral-small-3.1-24b-instruct", {
      messages: [
        { role: "system", content: "Summarize this blog post in exactly 2 sentences." },
        { role: "user", content: post.content },
      ],
    });
    return c.json({ summary: response.response });
  } catch (e) {
    console.error("Summarize failed:", e);
    return c.json({ error: "Could not generate summary right now" }, 500);
  }
});