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
  };
  Variables: {
    userId: string;
  };
}>();

// blogRouter.use("/*", async (c, next) => {
//   const jwt = c.req.header("Authorization");
//   if (!jwt) {
//     c.status(401);
//     return c.json({ error: "unauthorized" });
//   }
//   const token = jwt.split(" ")[1];

//   const payload = await verify(token, c.env.JWT_SECRET);
//   if (!payload || typeof payload.id !== "string") {
//     c.status(401);
//     return c.json({ error: "unauthorized" });
//   }
//   c.set("userId", payload.id);
//   await next();
// });

blogRouter.use("/*", authMiddleware);


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
      },
    });
    c.status(201);
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
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
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
      },
    });
    c.status(201);
    return c.json({ post });
  } catch (e) {
    console.error("Error fetching post", e);
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});
