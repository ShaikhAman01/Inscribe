import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const publicBlogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

publicBlogRouter.get("/", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    
    try {
      const post = await prisma.post.findMany({
        where: {
            author: {
              name: {
                not: "johndoe",
              },
            },},
        select: {
          content: true,
          title: true,
          id: true,
        },
        take: 3,
      });
      c.status(200);
      return c.json({ post });
    } catch (e) {
      console.error("Error fetching posts", e);
      c.status(500);
      return c.json({ error: "Failed to fetch posts" });
    }
  });
